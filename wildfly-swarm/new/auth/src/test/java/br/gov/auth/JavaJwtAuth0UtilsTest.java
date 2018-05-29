package br.gov.auth;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

import java.nio.charset.StandardCharsets;
import java.security.interfaces.RSAKey;

import org.apache.commons.codec.binary.Base64;
import org.junit.Test;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;

import br.gov.auth.util.JsonMatcher;
import br.gov.auth.util.PemUtils;

/**
 * 
 * 
 *
 */
public class JavaJwtAuth0UtilsTest {

	private static final String PRIVATE_KEY_FILE_RSA = "src/test/resources/rsa-private.pem";
	private static final String PUBLIC_KEY_FILE_RSA = "src/test/resources/rsa-public.pem";

	@Test
	public void shouldDecodeAStringToken() throws Exception {

		String token = "eyJhbGciOiJIUzI1NiIsImN0eSI6IkpXVCJ9.eyJpc3MiOiJhdXRoMCJ9.mZ0m_N1J4PgeqWmi903JuUoDRZDBPB7HwkS4nVyWH1M";
		DecodedJWT jwt = JWT.decode(token);

		assertThat(jwt, is(notNullValue()));
		assertThat(jwt.getToken(), is(notNullValue()));

	}

	@SuppressWarnings("deprecation")
	@Test
	public void shouldCreateAnEmptyRSA256SignedToken() throws Exception {

		//Geracao JWT assinado com chave privada:
		String signed = JWT.create().sign(Algorithm.RSA256((RSAKey) PemUtils.readPrivateKeyFromFile(PRIVATE_KEY_FILE_RSA, "RSA")));
		assertThat(signed, is(notNullValue()));

		String[] parts = signed.split("\\.");
		String headerJson = new String(Base64.decodeBase64(parts[0]), StandardCharsets.UTF_8);
		assertThat(headerJson, JsonMatcher.hasEntry("alg", "RS256"));
		assertThat(headerJson, JsonMatcher.hasEntry("typ", "JWT"));
		assertThat(parts[1], is("e30"));

		JWTVerifier verified = JWT.require(Algorithm.RSA256((RSAKey) PemUtils.readPublicKeyFromFile(PUBLIC_KEY_FILE_RSA, "RSA")))
				.build();

		assertThat(verified, is(notNullValue()));

		DecodedJWT jwt = verified.verify(signed);
		assertThat(jwt, is(notNullValue()));
		assertThat(jwt.getAlgorithm(), is("RS256"));
		assertThat(jwt.getType(), is("JWT"));

	}

	@Test
	public void shouldAcceptCustomClaimOfTypeInteger() throws Exception {
		
		JWTCreator.Builder builder = com.auth0.jwt.JWT.create();
		
		String jwt = builder.withClaim("name", 123).sign(Algorithm.HMAC256("secret"));
		System.out.println("jwt: "+jwt);
		assertThat(jwt, is(notNullValue()));
		String[] parts = jwt.split("\\.");
		assertThat(parts[1], is("eyJuYW1lIjoxMjN9"));
		
		String headerJson = new String(Base64.decodeBase64(parts[1]), StandardCharsets.UTF_8);
		assertThat(headerJson, JsonMatcher.hasEntry("name", 123));
		
	}

	@SuppressWarnings("deprecation")
	@Test
	public void shouldAcceptRSA256Algorithm() throws Exception {
		String token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoMCJ9.dxXF3MdsyW-AuvwJpaQtrZ33fAde9xWxpLIg9cO2tMLH2GSRNuLAe61KsJusZhqZB9Iy7DvflcmRz-9OZndm6cj_ThGeJH2LLc90K83UEvvRPo8l85RrQb8PcanxCgIs2RcZOLygERizB3pr5icGkzR7R2y6zgNCjKJ5_NJ6EiZsGN6_nc2PRK_DbyY-Wn0QDxIxKoA5YgQJ9qafe7IN980pXvQv2Z62c3XR8dYuaXBqhthBj-AbaFHEpZapN-V-TmuLNzR2MCB6Xr7BYMuCaqWf_XU8og4XNe8f_8w9Wv5vvgqMM1KhqVpG5VdMJv4o_L4NoCROHhtUQSLRh2M9cA";
		RSAKey key = (RSAKey) PemUtils.readPublicKeyFromFile(PUBLIC_KEY_FILE_RSA, "RSA");
		DecodedJWT jwt = JWT.require(Algorithm.RSA256(key)).build().verify(token);

		assertThat(jwt, is(notNullValue()));
		assertThat(jwt.getAlgorithm(), is("RS256"));
		assertThat(jwt.getType(), is("JWT"));
		assertThat(jwt.getSignature(), is("dxXF3MdsyW-AuvwJpaQtrZ33fAde9xWxpLIg9cO2tMLH2GSRNuLAe61KsJusZhqZB9Iy7DvflcmRz-9OZndm6cj_ThGeJH2LLc90K83UEvvRPo8l85RrQb8PcanxCgIs2RcZOLygERizB3pr5icGkzR7R2y6zgNCjKJ5_NJ6EiZsGN6_nc2PRK_DbyY-Wn0QDxIxKoA5YgQJ9qafe7IN980pXvQv2Z62c3XR8dYuaXBqhthBj-AbaFHEpZapN-V-TmuLNzR2MCB6Xr7BYMuCaqWf_XU8og4XNe8f_8w9Wv5vvgqMM1KhqVpG5VdMJv4o_L4NoCROHhtUQSLRh2M9cA"));
		assertThat(jwt.getIssuer(), is("auth0"));
		assertThat(this.splitToken(token)[1], is("eyJpc3MiOiJhdXRoMCJ9"));

	}

//	@Test
//	public void shouldThrowOnInvalidCustomClaimValueOfTypeString() throws Exception {
//
//		//exception.expectMessage("The Claim 'name' value doesn't match the required one.");
//		String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjpbInNvbWV0aGluZyJdfQ.3ENLez6tU_fG0SVFrGmISltZPiXLSHaz_dyn-XFTEGQ";
//		JWTVerifier.init(Algorithm.HMAC256("secret"))
//		.withClaim("name", "value")
//		.build()
//		.verify(token);
//	}

	private String[] splitToken(String token) throws JWTDecodeException {
		String[] parts = token.split("\\.");
		if (parts.length == 2 && token.endsWith(".")) {
			//Tokens with alg='none' have empty String as Signature.
			parts = new String[]{parts[0], parts[1], ""};
		}
		if (parts.length != 3) {
			throw new JWTDecodeException(String.format("The token was expected to have 3 parts, but got %s.", parts.length));
		}
		return parts;
	}
}
