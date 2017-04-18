package br.gov.serpro.supde.infra.batch.core.support.ods;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.xml.namespace.QName;
import javax.xml.stream.XMLEventFactory;
import javax.xml.stream.XMLEventWriter;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.Attribute;
import javax.xml.stream.events.EndElement;
import javax.xml.stream.events.StartElement;

import org.springframework.batch.item.file.transform.ExtractorLineAggregator;

public class ODSLineAggregator<T> extends ExtractorLineAggregator<T> {

	@Override
	protected String doAggregate(Object[] fields) {
		StringWriter sw = new StringWriter();

		try {
			XMLOutputFactory outputFactory = XMLOutputFactory.newInstance();
			XMLEventWriter xmlWriter = outputFactory.createXMLEventWriter(sw);
			XMLEventFactory eventFactory = XMLEventFactory.newInstance();

			QName styleNameQName = new QName(ODSItemWriter.URI_TABLE, "style-name", ODSItemWriter.PREFFIX_TABLE);
			Attribute styleNameAttr = eventFactory.createAttribute(styleNameQName, "ro1");

			List<Attribute> attrs = new ArrayList<Attribute>();
			attrs.add(styleNameAttr);

			QName tableRowQname = new QName(ODSItemWriter.URI_TABLE, "table-row", ODSItemWriter.PREFFIX_TABLE);
			StartElement tableRowStart = eventFactory.createStartElement(tableRowQname, attrs.iterator(), null);

			xmlWriter.add(tableRowStart);

			// <table:table-row table:style-name="ro1">
			QName tableCellQname = new QName(ODSItemWriter.URI_TABLE, "table-cell", ODSItemWriter.PREFFIX_TABLE);
			QName valueTypeQname = new QName(ODSItemWriter.URI_OFFICE, "value-type", ODSItemWriter.PREFFIX_OFFICE);

			Attribute valueTypeAttr = eventFactory.createAttribute(valueTypeQname, "string");

			List<Attribute> tableCellAttrs = new ArrayList<Attribute>();
			tableCellAttrs.add(valueTypeAttr);

			QName pQname = new QName(ODSItemWriter.URI_TEXT, "p", ODSItemWriter.PREFFIX_TEXT);
			for (Object field : fields) {

				if (field != null) {
					StartElement tableCellStart = eventFactory.createStartElement(tableCellQname,
							tableCellAttrs.iterator(), null);
					xmlWriter.add(tableCellStart);

					StartElement pStart = eventFactory.createStartElement(pQname, null, null);
					xmlWriter.add(pStart);

					xmlWriter.add(eventFactory.createCharacters(field.toString()));

					EndElement pEnd = eventFactory.createEndElement(pQname, null);
					xmlWriter.add(pEnd);

					EndElement tableCellEnd = eventFactory.createEndElement(tableCellQname, null);
					xmlWriter.add(tableCellEnd);
					/*
					 * <table:table-cell office:value-type="string">
					 * <text:p>b1</text:p> </table:table-cell>
					 */
				}
			}

			// </table:table-row>
			EndElement tableRowEnd = eventFactory.createEndElement(tableRowQname, null);
			xmlWriter.add(tableRowEnd);

		} catch (XMLStreamException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

		return sw.toString();
	}

}