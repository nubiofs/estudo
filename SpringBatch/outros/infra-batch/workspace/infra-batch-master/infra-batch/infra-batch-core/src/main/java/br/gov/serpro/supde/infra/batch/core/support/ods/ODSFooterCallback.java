package br.gov.serpro.supde.infra.batch.core.support.ods;

import javax.xml.stream.XMLEventWriter;
import javax.xml.stream.XMLStreamException;

public interface ODSFooterCallback {
	
	public void writeFooter(XMLEventWriter writer) throws XMLStreamException;

}
