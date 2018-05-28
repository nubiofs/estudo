package com.example.demo.interceptor.exception;

//public class HttpServletRequestResponseException extends RuntimeException {
public class HttpServletRequestResponseException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public HttpServletRequestResponseException(String mensagem) {
		super(mensagem);
	}

	public HttpServletRequestResponseException(Throwable cause) {
		super(cause);
	}

	public HttpServletRequestResponseException(String mensagem, Throwable cause) {
		super(mensagem, cause);
	}

}
