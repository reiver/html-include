// <html-include />
// https://github.com/reiver/html-include
//
// Examples:
//
// Basic usage:
//
//	<html-include src="footer.html" />
//
//	<html-include src="includes/header.html" />
//
// Advanced usage:
//
//	<html-include title="footer" src="footer.html" />
//	
//	Note the addition of the ‘title’ attribute.
//	
//	This usage will show a more informative loading message.
//	I.e., instead of showing:
//	
//		Loading…
//	
//	… it will show:
//	
//		Loading “footer”…
//	
//	 I.e., it includes whatever is in the ‘title’ attribute in the loading-message.
//
// Debugging:
//
//
//	<html-include debug="true" src="footer.html" />
//
//	<html-include debug="true" title="footer" src="footer.html" />
//
//	Note the addition of the ‘debug’ attribute, with the value set to the string "true".
//	
//	This will call console.log() with logs that try to provide inside into what <html-include> is doing internally.

/*
Copyright (c) 2020 Charles Iliya Krempeaux :: http://changelog.ca/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

class HTMLInclude extends HTMLElement {
	constructor() {
		super();

		// this._loaded is used to communite whether data specified by the ‘src’ attribute was able to be fetched or not.
		//
		// For example, if we had:
		//
		//	<html-include src="http://example.com/footer.html" />
		//
		// Then this._loaded would store true if we were able to fetch data from it, and false otherwise.
		//
		// This is sensitive to race-conditions.
		//
		// When this was coded, not all the common browsers supported JavaScript class
		// private instance fields. So this convention was used.
		this._loaded = false;

		// this._failed is used to specify whether the attempt to fetch data from the URI
		// specified by the ‘src’ attribute failed or not.
		//
		// This is sensitive to race-conditions.
		//
		// When this was coded, not all the common browsers supported JavaScript class
		// private instance fields. So this convention was used.
		this._failed = false;

		// set up a secret shadow DOM.
		const shadow = this.attachShadow({ mode: "closed" });
		const div = document.createElement("div");
		div.textContent = "Loading…";
		shadow.appendChild(div);

		// this._shadow stores the secret shadow DOM.
		//
		// When this was coded, not all the common browsers supported JavaScript class
		// private instance fields. So this convention was used.
		this._shadow = shadow;
	}

	static get observedAttributes(){
		return ["src","title"];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		this.log("[attributeChangedCallback] BEGIN");

		this.log("[attributeChangedCallback] name =", name);
		this.log("[attributeChangedCallback] old-value =", oldValue);
		this.log("[attributeChangedCallback] new-value =", newValue);

		switch (name) {
			case "src":
				this.whenSrcUpdated();
			break;
			case "title":
				this.whenTitleUpdated();
			break;
		}

		this.log("[attributeChangedCallback] END");
	}
	connectedCallback(){
		this.log("[connectedCallback] BEGIN");

		this.whenTitleUpdated();
		this.whenSrcUpdated();

		this.log("[connectedCallback] END");
	}

	whenTitleUpdated() {
		this.log("[whenTitleUpdated] BEGIN");

		if (this._loaded) {
			this.log("[whenTitleUpdated] NOT LOADED");
			this.log("[whenTitleUpdated] RETURN-END");
			return;
		}

		let title = this.getAttribute("title");
		this.log("[whenTitleUpdated] title =", title);
		this.log("[whenTitleUpdated] failed =", this._failed);
		if (title) {
			if (this._failed) {
				this._shadow.textContent = "⚠️ Loading “" + title + "” failed!";
			} else {
				this._shadow.textContent = "Loading “" + title + "”…";
			}
		} else {
			if (this._failed) {
				this._shadow.textContent = "⚠️ Loading failed!";
			} else {
				this._shadow.textContent = "Loading…";
			}
		}

		this.log("[whenTitleUpdated] END");
	}

	whenSrcUpdated() {
		this.log("[whenSrcUpdated] BEGIN");

		if (!this.isConnected) {
			this.log("[whenSrcUpdated] NOT-CONNECTED");
			this.log("[whenSrcUpdated] RETURN-END");
			return;
		}
		this._loaded = false;
		this._failed = false;
		this.loadSrc();

		this.log("[whenSrcUpdated] END");
	}

	// loadSrc looks at the <html-include> elements ‘src’ attribute, and tries to fetch
	// content from the URI it finds in the ‘src’ attribute. If the loading succeeds, then
	// it sets this._loaded to true, and makes the content show up on the web page.
	async loadSrc() {
		this.log("[loadSrc] BEGIN");

		const src = this.getAttribute("src");
		if (!src) {
			this.log("[loadSrc] THROW 1");
			throw new Error("<html-include> error: missing ‘src’ attribute on <html-include> element.");
		}

		let response = await fetch(src);
		if (!response.ok || 200 != response.status) {
			this.log("[loadSrc] THROW 2");
			throw this.failLoading(src, response.statusText);
		}

		const content = await response.text();
		this.log("[loadSrc] content =", content);

		this._failed = false;
		this._shadow.innerHTML = content;
		this._loaded = true;

		this.log("[loadSrc] END");
	}

	failLoading(src, reason) {
		this.log("[failLoading] BEGIN");

		this._failed = true;
		this._loaded = false;
		this.whenTitleUpdated();

		this.log("[failLoading] THROW");
		return new Error(`<html-include> error: could not fetch URI specified by ‘src’ attribute on <html-include> element (i.e., ⸨${src}⸩) because: ${reason}`);
	}

	log(...args) {
		let debug = this.getAttribute("debug");
		if ("true" !== debug) {
			return;
		}

		args.unshift("<html-include>");
		console.log(...args);
	}
}

window.customElements.define("html-include", HTMLInclude);
