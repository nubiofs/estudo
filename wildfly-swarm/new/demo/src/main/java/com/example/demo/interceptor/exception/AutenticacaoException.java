package com.example.demo.interceptor.exception;

//public class AutenticacaoException extends RuntimeException {
public class AutenticacaoException extends Exception {

	private static final long serialVersionUID = 1L;

	public AutenticacaoException(String mensagem) {
		super(mensagem);
	}

	public AutenticacaoException(Throwable cause) {
		super(cause);
	}

	public AutenticacaoException(String mensagem, Throwable cause) {
		super(mensagem, cause);
	}
	
}
