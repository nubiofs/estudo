package home.bookmarks.view;

import java.io.Serializable;
import java.security.cert.X509Certificate;

public class Certificates implements Serializable {	

	private static final long serialVersionUID = 1L;

	private X509Certificate certificate;

	private X509Certificate[] chain;

	public X509Certificate getCertificate() {
		return certificate;
	}

	public void setCertificate(X509Certificate certificate) {
		this.certificate = certificate;
	}

	public X509Certificate[] getChain() {
		return chain;
	}

	public void setChain(X509Certificate[] chain) {
		this.chain = chain;
	}

	public boolean isEmpty() {
		return certificate == null;
	}
}
