package org.tutorial.QuickStart;

import static junit.framework.Assert.assertNotNull;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;

import br.gov.frameworkdemoiselle.junit.DemoiselleRunner;

@RunWith(DemoiselleRunner.class)
public class MainTest {

	@Inject
	private Main main;

	@Test
	public void say() {
		assertNotNull(main);
		main.say();
	}
	
}
