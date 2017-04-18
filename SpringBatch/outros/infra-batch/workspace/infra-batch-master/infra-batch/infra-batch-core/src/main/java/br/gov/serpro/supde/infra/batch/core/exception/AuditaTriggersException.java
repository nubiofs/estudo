package br.gov.serpro.supde.infra.batch.core.exception;

public class AuditaTriggersException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AuditaTriggersException(String message) {
		super(message);
	}

	public AuditaTriggersException(Throwable cause) {
		super(cause);
	}
	
}
