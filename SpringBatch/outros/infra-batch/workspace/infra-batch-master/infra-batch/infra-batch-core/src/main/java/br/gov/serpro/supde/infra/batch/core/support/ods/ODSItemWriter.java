package br.gov.serpro.supde.infra.batch.core.support.ods;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.xml.namespace.QName;
import javax.xml.stream.XMLEventFactory;
import javax.xml.stream.XMLEventWriter;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.Attribute;
import javax.xml.stream.events.Namespace;
import javax.xml.stream.events.StartElement;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.file.FlatFileFooterCallback;
import org.springframework.batch.item.file.FlatFileHeaderCallback;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.transform.FieldExtractor;
import org.springframework.batch.item.file.transform.PassThroughFieldExtractor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.Resource;

/*
 * ItemWriter para criar arquivos ODS.
 * 
 * 
 */

public class ODSItemWriter<T> extends FlatFileItemWriter<T> implements StepExecutionListener, InitializingBean {

	public static final String URI_OFFICE = "urn:oasis:names:tc:opendocument:xmlns:office:1.0";
	public static final String PREFFIX_OFFICE = "office";
	
	public static final String URI_STYLE = "urn:oasis:names:tc:opendocument:xmlns:style:1.0";
	public static final String PREFFIX_STYLE = "style";
	
	public static final String URI_TEXT = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
	public static final String PREFFIX_TEXT = "text";
	
	public static final String URI_TABLE = "urn:oasis:names:tc:opendocument:xmlns:table:1.0";
	public static final String PREFFIX_TABLE = "table";
	
	public static final String URI_FO = "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0";
	public static final String PREFFIX_FO = "fo";
	
	private static final Set<Namespace> namespaces;
	
	static {
		XMLEventFactory eventFactory = XMLEventFactory.newInstance();				
		
		namespaces = new HashSet<Namespace>();
		
		namespaces.add(eventFactory.createNamespace(PREFFIX_OFFICE, URI_OFFICE));
		namespaces.add(eventFactory.createNamespace(PREFFIX_STYLE, URI_STYLE));
		namespaces.add(eventFactory.createNamespace(PREFFIX_TEXT, URI_TEXT));
		namespaces.add(eventFactory.createNamespace(PREFFIX_TABLE, URI_TABLE));
		namespaces.add(eventFactory.createNamespace(PREFFIX_FO, URI_FO));
	}
	
	private Resource resource;
	private Resource tmpResource;
	
	private Integer numberColumns;
	private String name = "Spreadsheet1";
	
	private FieldExtractor<T> fieldExtractor = new PassThroughFieldExtractor<T>();
	
	private XMLEventWriter xmlWriter;
	private XMLEventFactory eventFactory = XMLEventFactory.newInstance();
	
	private ODSHeaderCallback odsHeaderCallback;
	private ODSFooterCallback odsFooterCallback;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		super.setHeaderCallback(new HeaderCallback());
		super.setFooterCallback(new FooterCallback());
		
		ODSLineAggregator<T> lineAggregator = new ODSLineAggregator<T>();
		lineAggregator.setFieldExtractor(fieldExtractor);
		setLineAggregator(lineAggregator);
		
		tmpResource = resource.createRelative(resource.getFilename() + "_tmp.xml");
		
		super.setResource(tmpResource);
		super.afterPropertiesSet();
	}

	public void setResource(Resource resource) {
		this.resource = resource;
	}

	public void setNumberColumns(Integer numberColumns) {
		this.numberColumns = numberColumns;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setFieldExtractor(FieldExtractor<T> fieldExtractor) {
		this.fieldExtractor = fieldExtractor;
	}

	public void setHeaderCallback(ODSHeaderCallback odsHeaderCallback) {
		this.odsHeaderCallback = odsHeaderCallback;
	}

	public void setFooterCallback(ODSFooterCallback odsFooterCallback) {
		this.odsFooterCallback = odsFooterCallback;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		try {
			ODSBuilder.build(tmpResource.getURI(), resource.getFile());
		} catch(Exception e) {
			throw new RuntimeException(e);
		}
		
		return null;
	}
	
	private class HeaderCallback implements FlatFileHeaderCallback {

		@Override
		public void writeHeader(Writer writer) throws IOException {
			try {
				
				XMLOutputFactory outputFactory = XMLOutputFactory.newInstance();
			    xmlWriter = outputFactory.createXMLEventWriter(writer);
			    
				QName versionQName = new QName(URI_OFFICE, "version", PREFFIX_OFFICE);
				Attribute versionAttr = eventFactory.createAttribute(versionQName, "1.2");
				
				List<Attribute> attrs = new ArrayList<Attribute>();
				attrs.add(versionAttr);
				
				QName documentContentQName = new QName(URI_OFFICE, "document-content", PREFFIX_OFFICE);
				StartElement documentContentStart = eventFactory.createStartElement(documentContentQName, attrs.iterator(), namespaces.iterator());
			
				xmlWriter.add(documentContentStart);
				
				writeStyles(xmlWriter, eventFactory);
				
				writeBody(xmlWriter, eventFactory);
				
				if(odsHeaderCallback != null) {
					odsHeaderCallback.writeHeader(xmlWriter);
				}
				
			} catch (XMLStreamException e) {
				e.printStackTrace();
				throw new IOException(e);
			}
			
		}
		
		private void writeStyles(XMLEventWriter xmlWriter, XMLEventFactory eventFactory) throws XMLStreamException {
			
			QName scriptsQName = new QName(URI_OFFICE, "scripts", PREFFIX_OFFICE);
			xmlWriter.add(eventFactory.createStartElement(scriptsQName, null, null));
			xmlWriter.add(eventFactory.createEndElement(scriptsQName, null));
			
			
			QName automaticStylesQName = new QName(URI_OFFICE, "automatic-styles", PREFFIX_OFFICE);
			xmlWriter.add(eventFactory.createStartElement(automaticStylesQName, null, null));
			
			//<style:style style:name="co1" style:family="table-column">
			QName styleQName = new QName(URI_STYLE, "style", PREFFIX_STYLE);
			QName styleNameQName = new QName(URI_STYLE, "name", PREFFIX_STYLE);
			QName styleFamilyQName = new QName(URI_STYLE, "family", PREFFIX_STYLE);
			
			Attribute co1StyleNameAttr = eventFactory.createAttribute(styleNameQName, "co1");
			Attribute co1StyleFamilyAttr = eventFactory.createAttribute(styleFamilyQName, "table-column");
			
			List<Attribute> co1Attrs = new ArrayList<Attribute>();
			co1Attrs.add(co1StyleNameAttr);
			co1Attrs.add(co1StyleFamilyAttr);
			
			xmlWriter.add(eventFactory.createStartElement(styleQName, co1Attrs.iterator(), null));
			
			//<style:table-column-properties fo:break-before="auto" style:column-width="2.258cm" />
			QName tableColumnPropertiesQName = new QName(URI_STYLE, "table-column-properties", PREFFIX_STYLE);
			QName breakBeforeQName = new QName(URI_FO, "break-before", PREFFIX_FO);
			QName columnWidthQName = new QName(URI_STYLE, "column-width", PREFFIX_STYLE);
			
			Attribute breakBeforeAttr = eventFactory.createAttribute(breakBeforeQName, "auto");
			Attribute columnWidthAttr = eventFactory.createAttribute(columnWidthQName, "2.258cm");
			
			List<Attribute> tableColumnAttrs = new ArrayList<Attribute>();
			tableColumnAttrs.add(breakBeforeAttr);
			tableColumnAttrs.add(columnWidthAttr);
			
			xmlWriter.add(eventFactory.createStartElement(tableColumnPropertiesQName, tableColumnAttrs.iterator(), null));
			
			xmlWriter.add(eventFactory.createEndElement(tableColumnPropertiesQName, null));
			
			//</style:style>
			xmlWriter.add(eventFactory.createEndElement(styleQName, null));
			
			//<style:style style:name="ro1" style:family="table-row">
			Attribute ro1StyleNameAttr = eventFactory.createAttribute(styleNameQName, "ro1");
			Attribute ro1StyleFamilyAttr = eventFactory.createAttribute(styleFamilyQName, "table-row");
			
			List<Attribute> ro1Attrs = new ArrayList<Attribute>();
			ro1Attrs.add(ro1StyleNameAttr);
			ro1Attrs.add(ro1StyleFamilyAttr);
			
			xmlWriter.add(eventFactory.createStartElement(styleQName, ro1Attrs.iterator(), null));
			
			//<style:table-row-properties style:row-height="0.452cm" fo:break-before="auto" style:use-optimal-row-height="true" />
			QName tableRowPropertiesQName = new QName(URI_STYLE, "table-row-properties", PREFFIX_STYLE);
			QName rowHeightQName = new QName(URI_STYLE, "row-height", PREFFIX_STYLE);
			QName useOptimalRowHeightQName = new QName(URI_STYLE, "use-optimal-row-height", PREFFIX_STYLE);
			
			Attribute rowHeightAttr = eventFactory.createAttribute(rowHeightQName, "0.452cm");
			Attribute useOptimalRowHeightAttr = eventFactory.createAttribute(useOptimalRowHeightQName, "true");
			
			List<Attribute> tableRowPropertiesAttrs = new ArrayList<Attribute>();
			tableRowPropertiesAttrs.add(rowHeightAttr);
			tableRowPropertiesAttrs.add(breakBeforeAttr);
			tableRowPropertiesAttrs.add(useOptimalRowHeightAttr);

			xmlWriter.add(eventFactory.createStartElement(tableRowPropertiesQName, tableRowPropertiesAttrs.iterator(), null));
			xmlWriter.add(eventFactory.createEndElement(tableRowPropertiesQName, null));
			
			//</style:style>
			xmlWriter.add(eventFactory.createEndElement(styleQName, null));
			
			//<style:style style:name="ta1" style:family="table" style:master-page-name="Default">
			QName masterPageNameQName = new QName(URI_STYLE, "master-page-name", PREFFIX_STYLE);
			Attribute ta1NameAttr = eventFactory.createAttribute(styleNameQName, "ta1");
			Attribute ta1FamilyAttr = eventFactory.createAttribute(styleFamilyQName, PREFFIX_TABLE);
			Attribute ta1MasterPageNameAttr = eventFactory.createAttribute(masterPageNameQName, "Default");
			
			List<Attribute> ta1Attrs = new ArrayList<Attribute>();
			ta1Attrs.add(ta1NameAttr);
			ta1Attrs.add(ta1FamilyAttr);
			ta1Attrs.add(ta1MasterPageNameAttr);
			
			xmlWriter.add(eventFactory.createStartElement(styleQName, ta1Attrs.iterator(), null));
			
			//<style:table-properties table:display="true" style:writing-mode="lr-tb" />
			QName tablePropertiesQName = new QName(URI_STYLE, "table-properties", PREFFIX_STYLE);
			QName displayQName = new QName(URI_TABLE, "display", PREFFIX_TABLE);
			QName writingModeQName = new QName(URI_STYLE, "writing-mode", PREFFIX_STYLE);
			
			Attribute displayAttr = eventFactory.createAttribute(displayQName, "true");
			Attribute writingModeAttr = eventFactory.createAttribute(writingModeQName, "lr-tb");
			
			List<Attribute> tablePropertiesAttrs = new ArrayList<Attribute>();
			tablePropertiesAttrs.add(displayAttr);
			tablePropertiesAttrs.add(writingModeAttr);
			
			xmlWriter.add(eventFactory.createStartElement(tablePropertiesQName, tablePropertiesAttrs.iterator(), null));
			
			xmlWriter.add(eventFactory.createEndElement(tablePropertiesQName, null));
			
			//</style:style>
			xmlWriter.add(eventFactory.createEndElement(styleQName, null));
			
			//</office:automatic-styles>
			xmlWriter.add(eventFactory.createEndElement(automaticStylesQName, null));
		}
		
		private void writeBody(XMLEventWriter xmlWriter, XMLEventFactory eventFactory) throws XMLStreamException {
			
			QName bodyQName = new QName(URI_OFFICE, "body", PREFFIX_OFFICE);
			xmlWriter.add(eventFactory.createStartElement(bodyQName, null, null));
			
			QName spreadsheetQName = new QName(URI_OFFICE, "spreadsheet", PREFFIX_OFFICE);
			xmlWriter.add(eventFactory.createStartElement(spreadsheetQName, null, null));
			
			//<table:table table:name="Planilha1" table:style-name="ta1">
			QName tableQName = new QName(URI_TABLE, "table", PREFFIX_TABLE);
			QName nameQName = new QName(URI_TABLE, "name", PREFFIX_TABLE);
			QName styleNameQName = new QName(URI_TABLE, "style-name", PREFFIX_TABLE);
			
			Attribute nameAttr = eventFactory.createAttribute(nameQName, name);
			Attribute styleNameAttr = eventFactory.createAttribute(styleNameQName, "ta1");
			
			List<Attribute> tableAttrs = new ArrayList<Attribute>();
			tableAttrs.add(nameAttr);
			tableAttrs.add(styleNameAttr);
			
			xmlWriter.add(eventFactory.createStartElement(tableQName, tableAttrs.iterator(), null));
			
			//<table:table-column table:style-name="co1" table:number-columns-repeated="2" table:default-cell-style-name="Default" />
			QName tableColumnQName = new QName(URI_TABLE, "table-column", PREFFIX_TABLE);
			QName numberColumnsRepeatedQName = new QName(URI_TABLE, "number-columns-repeated", PREFFIX_TABLE);
			QName defaultCellStyleNameQName = new QName(URI_TABLE, "default-cell-style-name", PREFFIX_TABLE);
			
			Attribute tableColStyleAttr = eventFactory.createAttribute(styleNameQName, "co1");
			Attribute tableColRepeatedAtr = eventFactory.createAttribute(numberColumnsRepeatedQName, String.valueOf(numberColumns));
			Attribute tableColDefaultStyleAttr = eventFactory.createAttribute(defaultCellStyleNameQName, "Default");
			
			List<Attribute> tableColAttrs = new ArrayList<Attribute>();
			tableColAttrs.add(tableColStyleAttr);
			tableColAttrs.add(tableColRepeatedAtr);
			tableColAttrs.add(tableColDefaultStyleAttr);
			
			xmlWriter.add(eventFactory.createStartElement(tableColumnQName, tableColAttrs.iterator(), null));
			xmlWriter.add(eventFactory.createEndElement(tableColumnQName, null));
			
		}
		
	}
	
	private class FooterCallback implements FlatFileFooterCallback {

		@Override
		public void writeFooter(Writer writer) throws IOException {

			try {
				
				if(odsFooterCallback != null) {
					odsFooterCallback.writeFooter(xmlWriter);					
				}
				
				QName tableQName = new QName(URI_TABLE, "table", PREFFIX_TABLE);
				QName spreadsheetQName = new QName(URI_OFFICE, "spreadsheet", PREFFIX_OFFICE);
				QName bodyQName = new QName(URI_OFFICE, "body", PREFFIX_OFFICE);
				QName documentContentQName = new QName(URI_OFFICE, "document-content", PREFFIX_OFFICE);
				
				xmlWriter.add(eventFactory.createEndElement(tableQName, null));
				xmlWriter.add(eventFactory.createEndElement(spreadsheetQName, null));
				xmlWriter.add(eventFactory.createEndElement(bodyQName, null));
				xmlWriter.add(eventFactory.createEndElement(documentContentQName, null));
				
				xmlWriter.add(eventFactory.createEndDocument());
			} catch (XMLStreamException e) {
				e.printStackTrace();
				throw new IOException(e);
			}
		    
		}
	
	}
	
}
