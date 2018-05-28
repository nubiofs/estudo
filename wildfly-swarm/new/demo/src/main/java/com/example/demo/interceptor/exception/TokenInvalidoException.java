package com.example.demo.interceptor.exception;

//public class TokenInvalidoException extends RuntimeException {
public class TokenInvalidoException extends Exception {

	private static final long serialVersionUID = 1L;

	public TokenInvalidoException(String mensagem) {
		super(mensagem);
	}

	public TokenInvalidoException(Throwable cause) {
		super(cause);
	}

	public TokenInvalidoException(String mensagem, Throwable cause) {
		super(mensagem, cause);
	}
	
}
