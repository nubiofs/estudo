+++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++
+++ via "keyStore Explorer 5.2.2" +++
+++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxx [Create a local dev CA, server_keystore.jks e server_truststore.jks] xxx
xxx EM "certificado/testes/stores-server" 				 xxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

$ ./kse.sh

1) [Criar "server_keystore.jks"] -> New -> keystore type "JKS" (com senha "changeit") -> com nome "server_keystore.jks"

2) [Criar "ca-derce"] -> Generate key Pair -> Algorithm "RSA"; key Size "4.096" -> Version "3"; Signature Algorithm "SHA-256 with RSA"; 
Name "CN=ca-derce;OU=derce;O=serpro;L=recife;ST=pe;C=br" -> Enter Alias "ca-derce" -> senha "changeit"

Com Certificate Extensions (para CA "ca-derce"):

- Basic Constraints "com Critial Extension"

	Subject is a CA Path 
	Length Constraint: None

- Key Usage "com Critial Extension"

	Certificate Signing 
	CRL Signing

Obs.:
 
-> "View details" -> "Certificate chain details" -> ASN.1 "Serial number do par criado: 1490802740 (0x58dbd834)"

3) [Criar "localhost" assinado por "ca-derce"] -> (botão direito sobre "ca-derce") Sign New Key Pair -> Algorithm "RSA"; key Size "4.096" -> Version "3"; Signature Algorithm "SHA-256 with RSA"; Name "CN=localhost;OU=derce;O=serpro;L=recife;ST=pe;C=br" -> Enter Alias "localhost" -> senha "changeit"

Com Certificate Extensions (para "localhost"):

- Basic Constraints "não Critial Extension"

	Subject is not a CA
	Length Constraint: None

Obs.: 

-> "View details" -> "Certificate chain details" -> ASN.1 "Serial number do par criado: 1490803147 (0x58dbd9cb)"

4) [Criar "server_truststore.jks"] -> New -> keystore type "JKS" (com senha "changeit") -> com nome "server_truststore.jks"

Obs.: Pode-se utilizar um TrustStore mais completo, por exemplo "Truststore-hom-pro-2015.jks", e fazer o proximo passo 
6) [Importar "certificado/testes/stores-server/ca_derce.cer" em "Truststore-hom-pro-2015.jks"]

5) [Exportar "ca-derce" em "server_keystore.jks"] -> (botão direito sobre "ca-derce") "View details" -> "Certificate chain details" -> Export "certificado/testes/stores-server/ca_derce.cer"

6) [Importar "certificado/testes/stores-server/ca_derce.cer" em "server_truststore.jks"] -> Import Trusted Certificate -> Enter Alias "ca-derce"

7) No standalone.xml (jboss eap 6.4), Configurações do keystore (parte servidor "server_keystore"):

<connector name="https" protocol="HTTP/1.1" scheme="https" socket-binding="https" secure="true">
                <ssl name="https" key-alias="localhost" password="changeit" 
                certificate-key-file="${jboss.server.config.dir}/certificado/testes/stores-server/server_keystore.jks" protocol="TLSv1" verify-client="true" />
</connector>

8) Configurações do truststore (parte servidor "server_truststore"), ficam no jboss em "standalone.conf" como:

JAVA_OPTS="$JAVA_OPTS -Djavax.net.ssl.keyStorePassword=changeit"
JAVA_OPTS="$JAVA_OPTS -Djavax.net.ssl.trustStore=/home/02963357460/Desenvolvimento-CNIR/ambiente/jboss-eap-6.4/standalone/configuration/certificado/senharede/original/Truststore-hom-pro-2015.jks"

"possivelmente, esse Truststore-hom-pro-2015.jks deve conter o CA que autentica o Certificado do Servidor"

9) Configurações do truststore (parte cliente "client_truststore"), ficam na aplicação como:

System.setProperty("javax.net.ssl.trustStore", "/home/02963357460/Desenvolvimento-CNIR/ambiente/jboss-eap-6.4/standalone/configuration/certificado/testes/stores-client/client_truststore.jks");
System.setProperty("javax.net.ssl.trustStorePassword", "changeit");

[IMPORTANTE]:

Informar o client_truststore.jks (da aplicação cliente) que possui um "Trusted Certificate entry" 
para o Certificado do Servidor/dominio (em server_keystore.jks 
"configurado no Jboss ${jboss.server.config.dir}/certificado/testes/stores-server/server_keystore.jks).")

Obs.: 
i) Comando para obter o Certificado do Servidor/dominio:
	$ echo -n | openssl s_client -connect localhost:8443 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > localhost.crt
ii) Comando para importar o Certificado do Servidor/dominio "localhost.crt" no client_truststore.jks:
	$ keytool -import -v -trustcacerts -alias localhost -file localhost.crt -keystore client_truststore.jks -keypass changeit -storepass changeit


10) Colocar "10.32.65.142.p12" (Certificado Digital e Chave privada da maquina cliente) em client_keystore.jks

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxx [Create a client_keystore.jks e client_truststore.jks] xxx
xxx EM "certificado/testes/stores-client"                  xxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

1) [Criar "client_keystore.jks"] -> New -> keystore type "JKS" (com senha "changeit") -> com nome "client_keystore.jks"

2) [Criar "client" assinado por "ca-derce" em "server_keystore.jks"] -> (botão direito sobre "ca-derce") Sign New Key Pair -> Algorithm "RSA"; key Size "4.096" -> Version "3"; Signature Algorithm "SHA-256 with RSA"; Name "CN=client;OU=derce;O=serpro;L=recife;ST=pe;C=br" -> Enter Alias "client (ca-derce)" -> senha "changeit"

3) [Exportar "client (ca-derce)" para "certificado/testes/stores-client"] -> (botão direito sobre "client (ca-derce)") Export -> Export Key Pair -> PKC #12 passwork "changeit" para "certificado/testes/stores-client/client_ca_derce_.p12"

4) [Delear "client (ca-derce)" em "server_keystore.jks"] -> (botão direito sobre "client (ca-derce)") Delete

5) [Importar "certificado/testes/stores-client/client_ca_derce_.p12" em "client_keystore.jks"] -> Import Key Pair "PKCS #12"-> Enter Alias "client (ca-derce)"
-> senha "changeit"

Obs.: 

-> "View details" -> "Certificate chain details" -> ASN.1 "Serial number do par criado: 1490804685 (0x58dbdfcd)"

6) [Copiar "server_truststore.jks" para "certificado/testes/stores-client/" como client_truststore.jks

7) No código da aplicação cliente java:

System.setProperty("javax.net.ssl.trustStore", "/home/02963357460/Desenvolvimento-CNIR/ambiente/jboss-eap-6.4/standalone/configuration/certificado/testes/stores-client/client_Truststore.jks");
System.setProperty("javax.net.ssl.trustStorePassword", "changeit");


+++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++
+++ via "openssl e keytool" +++
+++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxx [Create a local dev CA] COMANDOS EM "certificado/testes/CA-DEV"
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

$ openssl genrsa -out ca.key -aes256 -passout pass:changeit 4096

$ openssl req -new -x509 -key ca.key -days 3560 -sha256 -out ca.pem -passin pass:changeit

Country Name (2 letter code) [AU]:br
State or Province Name (full name) [Some-State]:pernambuco
Locality Name (eg, city) []:recife
Organization Name (eg, company) [Internet Widgits Pty Ltd]:serpro
Organizational Unit Name (eg, section) []:supde
Common Name (e.g. server FQDN or YOUR name) []:ca-derce
Email Address []:clenubio.souza@serpro.gov.br

$ openssl rsa -in ca.key -out ca.key -passin pass:changeit

=====================================================================
=== [LADO DO SERVIDOR] COMANDOS EM "certificado/testes/stores-server" 
=====================================================================

(1) Criação do "server_keystore.jks":

$ keytool -genkey -v -keyalg RSA -keysize 1024 -alias localhost -keystore server_keystore.jks -storepass changeit -keypass changeit -validity 1000 -dname "cn=localhost,o=host,c=br"

(2) [Generate server cert signing requests (csr) based on above keystore keypairs]:

$ keytool -certreq -v -alias localhost -keystore server_keystore.jks -storepass changeit -file localhost.csr 

(3) ["certificate signed by a CA" Sign the requests (create certs) for server csr's]:

$ openssl x509 -req -CA ../CA-DEV/ca.pem -CAkey ../CA-DEV/ca.key -in localhost.csr -out localhostPublicKey_ca-derce_Signed.cer -days 1000 -CAcreateserial

Obs.:

"Exportação do certificado (assinado por ca.pem), caso comando anterior não tenha gerado o (Signed_PublicKey.cer)":

$ keytool -export -keystore server_keystore.jks -alias localhost -file localhost_Signed_PublicKey.cer -keypass changeit -storepass changeit

(4) Criação do "server_truststore.jks", via "keyStore Explorer 5.2.2" [http://www.keystore-explorer.org/]:

-> New -> keystore do type "JKS" com senha "changeit" -> com nome "server_truststore.jks"

(5) [Import the CA cert into server truststore]:

$ keytool -import -storepass changeit -keystore server_truststore.jks -file ../CA-DEV/ca.pem -alias ca-derce

(6) Listando os stores criados:

$ keytool -list -keystore server_keystore.jks

$ keytool -list -keystore server_truststore.jks

====================================================================
=== [LADO DO CLIENTE] COMANDOS EM "certificado/testes/stores-client" 
====================================================================

(1) Criação do "client_keystore.jks":

$ keytool -genkey -keyalg RSA -alias client -keystore client_keystore.jks -storepass changeit -keypass changeit -validity 1000 -dname "cn=client,o=localhost,c=br"

(2) [Generate client cert signing requests (csr) based on above keystore keypairs]:

$ keytool -certreq -v -alias client -keystore client_keystore.jks -storepass changeit -file client.csr 

(3) ["certificate signed by a CA" Sign the requests (create certs) for client csr's]:

$ openssl x509 -req -CA ../CA-DEV/ca.pem -CAkey ../CA-DEV/ca.key -in client.csr -out clientPublicKey_ca-derce_Signed.cer -days 1000 -CAcreateserial

Obs.:

"Exportação do certificado (assinado por ca.pem), caso comando anterior não tenha gerado o (Signed_PublicKey.cer)":

$ keytool -export -keystore client_keystore.jks -alias client -file clientPublicKey_ca-derce_Signed.cer -keypass changeit -storepass changeit

(4) Criação do "client_truststore.jks", via "keyStore Explorer 5.2.2" [http://www.keystore-explorer.org/]:

-> New -> keystore do type "JKS" com senha "changeit" -> com nome "client_truststore.jks"

(5) [Import the CA cert into client truststore]:

$ keytool -import -storepass changeit -keystore client_truststore.jks -file ../CA-DEV/ca.pem -alias ca-derce

(6) Importação do Certificado do Servidor (localhost) no client_truststore.jks (ou "%JAVA_HOME%/jre/lib/security/cacerts"):

$ echo -n | openssl s_client -connect localhost:8443 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > localhost.crt

$ keytool -import -v -trustcacerts -alias localhost -file localhost.crt -keystore client_truststore.jks -keypass changeit -storepass changeit

(7) Listando os stores criados:

$ keytool -list -keystore client_keystore.jks

$ keytool -list -keystore client_truststore.jks


===========

OBS.:


X) [Import the CA cert into the JVM truststore]

//Original:
//$ sudo keytool -import -trustcacerts -alias suter-dev-ca -file ca.pem -keystore /Library/Java/JavaVirtualMachines/jdk1.7.0_60.jdk/Contents/Home/jre/lib/security/cacerts

Optionally, import the CA cert into your browser.

Your post was hard to read because of the formatting. Hope this helps.

Sources: http://shib.kuleuven.be/docs/ssl_commands.shtml, https://docs.oracle.com/cd/E19509-01/820-3503/ggezy/index.html



//Ou tudo via "https://github.com/escline/InstallCert"




(javax.net.debug)
 Prints debugging details for connections made.
Example: -Djavax.net.debug=all or -Djavax.net.debug=ssl:handshake:verbose

Current options are:

all: Turn on all debugging
ssl: Turn on SSL debugging

The following can be used with the ssl option:

record: Enable per-record tracing
handshake: Print each handshake message
keygen: Print key generation data
session: Print session activity
defaultctx: Print default SSL initialization
sslctx: Print SSLContext tracing
sessioncache: Print session cache tracing
keymanager: Print key manager tracing
trustmanager: Print trust manager tracing

-->  java -Djavax.net.debug=SSL,handshake,data,trustmanager MyApp


Obs.:

Se não informar nada em "standalone.conf" (tipo:

JAVA_OPTS="$JAVA_OPTS -Djavax.net.ssl.keyStorePassword=changeit"
JAVA_OPTS="$JAVA_OPTS -Djavax.net.ssl.trustStore=/home/02963357460/Desenvolvimento-CNIR/ambiente/jboss-eap-6.4/standalone/configuration/certificado/senharede/original/Truststore-hom-pro-2015.jks"
)

o "trustStore" is: /home/02963357460/Desenvolvimento-CNIR/ambiente/jdk1.8.0_121/jre/lib/security/cacerts


- Import the self-signed certificate:

keytool -import -trustcacerts -alias myselfsignedcert -file /Users/me/Desktop/selfsignedcert.crt -keystore ./privateKeystore.jks

- Add the official root certificates:

keytool -importkeystore -srckeystore <java-home>/lib/security/cacerts -destkeystore ./privateKeystore.jks


zzzzzzzzzzzzzzzzz
changeit
zzzzzzzzzzzzzzzzz

z Create the Root Key:

openssl genrsa -out rootCA.key 2048

openssl genrsa -des3 -out rootCA.key 2048

openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem

z Create A Certificate:

openssl genrsa -out device.key 2048

openssl req -new -key device.key -out device.csr

openssl x509 -req -in device.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out device.crt -days 500 -sha256


http://lcrspo.serpro.gov.br/ca/



yyyyyyyyyyyyyyyyyyyyy

https://github.com/intercommit/restlet-clientcert

(http://stackoverflow.com/questions/32506278/restlet-javax-net-ssl-sslhandshakeexception-null-cert-chain)

(http://stackoverflow.com/questions/18787491/adding-certificate-chain-to-p12pfx-certificate)

I figured out how to do this with OpenSSL:

openssl pkcs12 -in certificate.p12 -out clientcert.pem -nodes -clcerts
openssl x509 -in trusted_ca.cer -inform DER -out trusted_ca.pem
openssl x509 -in root_ca.cer -inform DER -out root_ca.pem
cat clientcert.pem trusted_ca.pem root_ca.pem >> clientcertchain.pem
openssl pkcs12 -export -in clientcertchain.pem -out clientcertchain.pfx

