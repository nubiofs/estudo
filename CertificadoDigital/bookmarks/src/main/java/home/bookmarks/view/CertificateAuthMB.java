/*
 * SERPRO Artifacts
 * Copyright (C) 2014 SERPRO
 * ----------------------------------------------------------------------------
 * This file is part of SERPRO Artifacts.
 * 
 * SERPRO Artifacts is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License version 3
 * as published by the Free Software Foundation.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License version 3
 * along with this program; if not,  see <http://www.gnu.org/licenses/>
 * or write to the Free Software Foundation, Inc., 51 Franklin Street,
 * Fifth Floor, Boston, MA  02110-1301, USA.
 * ----------------------------------------------------------------------------
 * Este arquivo é parte do SERPRO Artifacts.
 * 
 * O SERPRO Artifacts é um software livre; você pode redistribuí-lo e/ou
 * modificá-lo dentro dos termos da GNU LGPL versão 3 como publicada pela Fundação
 * do Software Livre (FSF).
 * 
 * Este programa é distribuído na esperança que possa ser útil, mas SEM NENHUMA
 * GARANTIA; sem uma garantia implícita de ADEQUAÇÃO a qualquer MERCADO ou
 * APLICAÇÃO EM PARTICULAR. Veja a Licença Pública Geral GNU/LGPL em português
 * para maiores detalhes.
 * 
 * Você deve ter recebido uma cópia da GNU LGPL versão 3, sob o título
 * "LICENCA.txt", junto com esse programa. Se não, acesse <http://www.gnu.org/licenses/>
 * ou escreva para a Fundação do Software Livre (FSF) Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02111-1301, USA.
 */
package home.bookmarks.view;

import java.security.Principal;
import java.security.cert.X509Certificate;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.inject.Named;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.gov.component.demoiselle.security.auth.Certificate;
import br.gov.component.demoiselle.security.certificate.CertificateManager;
import br.gov.component.demoiselle.security.certificate.extension.BasicCertificate;
import br.gov.frameworkdemoiselle.stereotype.ViewController;
import br.gov.frameworkdemoiselle.util.Beans;

@ViewController
//@Named("certificateAuthMB")
public class CertificateAuthMB {

	private static final Logger logger = LoggerFactory.getLogger(CertificateAuthMB.class);

	private String successPageRedirect;
	private String errorPageRedirect;

	private static final String CERTIFICATES_ATTR = "javax.servlet.request.X509Certificate";
	private Certificates certificates;
	
	public CertificateAuthMB() {
		System.out.println("iniciando CertificateAuthMB...");
	}

	public void login() {

		FacesContext context = FacesContext.getCurrentInstance();
		FacesMessage message;

		try {

			HttpServletRequest request = (HttpServletRequest) context.getExternalContext().getRequest();
			
			X509Certificate[] x509Certificates = getCertificates(request);

			if (x509Certificates != null) {

				setCertificates(x509Certificates);

				// SecurityContext securityContext =
				// Beans.getReference(SecurityContext.class);
				// securityContext.login();
				// boolean loggedIn = securityContext.isLoggedIn();

				try {

					BasicCertificate cert = new BasicCertificate(this.certificates.getCertificate());

					// authentication.authenticate(this.certificates.getCertificate());
					
					// Base64Utils
					// CRLValidator
					// PeriodValidator
					// ICPBRCertificatePF
					
					Object id = this.certificates.getCertificate();
					String cpf = (id instanceof X509Certificate) ? 
							this.getCpfFromCertificate((X509Certificate) id) : (String) id;
					

					Principal callerPrincipal = new Certificate(this.certificates.getCertificate());
				
					
				} catch (Throwable t) {
					// throwableHandler.handle(t);
				}

				boolean loggedIn = true;

				if (loggedIn) {
					logger.info("Login efetuado com sucesso, redirecionando para: " + successPageRedirect);
					context.getApplication().getNavigationHandler().handleNavigation(context, null,
							successPageRedirect);

				}

			} else {
				
				message = new FacesMessage(FacesMessage.SEVERITY_ERROR,
						"Não foi possível acessar o certificado do usuário.", null);

				FacesContext.getCurrentInstance().addMessage(null, message);

				context.getApplication().getNavigationHandler().handleNavigation(context, null, errorPageRedirect);
				
			}

		} catch (Exception e) {
			e.printStackTrace();
			//
			// if (request.getAttribute(RequestThrowableHandler.THROWABLE_KEY)
			// != null) {
			// context.getApplication().getNavigationHandler().handleNavigation(context,
			// null, errorPageRedirect);
			// } else {
			message = new FacesMessage(FacesMessage.SEVERITY_ERROR,
					"Falha no processamento do login. Consulte a equipe de suporte do sistema.", null);

			FacesContext.getCurrentInstance().addMessage(null, message);

			context.getApplication().getNavigationHandler().handleNavigation(context, null, errorPageRedirect);
			// }
		}
	}
	
	public static String getCpfFromCertificate(X509Certificate certificate){
		CertificateManager cm = new CertificateManager(certificate);
		ICPBrasilPerson user = cm.load(ICPBrasilPerson.class);

		return user.getCpf().isEmpty() ? null : user.getCpf();
	}
	
//	private void authenticateDB(Object id) throws Exception {
//		
//		if (this.dsJndiName == null || this.principalQuery == null) {
//			throw new LoginException("As propriedades cert.db.dsJndiName e cert.db.principalQuery não podem ser nulas");
//		}
//		
//		Connection conn = null;
//		PreparedStatement ps = null;
//		ResultSet rs = null;
//
//		try {
//
//			InitialContext ctx = new InitialContext();
//			DataSource ds = (DataSource) ctx.lookup(this.dsJndiName);
//			conn = ds.getConnection();
//			ps = conn.prepareStatement(this.principalQuery);
//
//			String cpf = (id instanceof X509Certificate) ? 
//					ICPBrasilUtil.getCpfFromCertificate((X509Certificate) id) : (String) id;
//			
//			ps.setString(1, cpf);
//			rs = ps.executeQuery();
//			
//			if (rs.next() && Long.valueOf(rs.getString(1)).equals(0L)) {
//				//return false;
//				throw new LoginException("Usuário não autenticado no banco de dados");
//			}
//
//		} catch (NamingException ex) {
//			LoginException le = new LoginException(
//					PicketBoxMessages.MESSAGES.failedToLookupDataSourceMessage(this.dsJndiName));
//			le.initCause(ex);
//			throw le;
//		} catch (SQLException ex) {
//			LoginException le = new LoginException(PicketBoxMessages.MESSAGES.failedToProcessQueryMessage());
//			le.initCause(ex);
//			throw le;
//		} finally {
//			if (rs != null) {
//				try {
//					rs.close();
//				} catch (SQLException e) {
//				}
//			}
//			if (ps != null) {
//				try {
//					ps.close();
//				} catch (SQLException e) {
//				}
//			}
//			if (conn != null) {
//				try {
//					conn.close();
//				} catch (SQLException ex) {
//				}
//			}
//
//		}
//
//	}


	private X509Certificate[] getCertificates(ServletRequest request) {
		return (X509Certificate[]) request.getAttribute(CERTIFICATES_ATTR);
	}

	private void setCertificates(X509Certificate[] x509Certificates) {

		this.certificates = Beans.getReference(Certificates.class);
		
		final int length = x509Certificates.length;

		if (length > 0) {

			this.certificates.setCertificate(x509Certificates[0]);

			if (length > 1) {

				X509Certificate[] chain = new X509Certificate[length - 1];

				for (int i = 1; i < length - 1; i++) {
					chain[i] = x509Certificates[i];
				}

				this.certificates.setChain(chain);

			}

		}

	}

	public String getSuccessPageRedirect() {
		return successPageRedirect;
	}

	public void setSuccessPageRedirect(String successPageRedirect) {
		this.successPageRedirect = successPageRedirect;
	}

	public String getErrorPageRedirect() {
		return errorPageRedirect;
	}

	public void setErrorPageRedirect(String errorPageRedirect) {
		this.errorPageRedirect = errorPageRedirect;
	}

}
