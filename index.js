#!/usr/bin/env node
"use strict";

import selectObjectFromJson from './selectObjectFromJson.js';
import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";

export default async function validateJSON(json, schemaUri, schemajson) {
    await validate(schemaUri, json, BASIC)
	.then(response => {
		if (response.valid) {
			alert("Success validating JSON");
		} else {
			alert("Error invalid JSON ");
			for (let e in response.errors) {
				let error = response.errors[e];
				if (!error.keyword.endsWith("validate")) {
					console.log("keyword:", error.keyword.substr(error.keyword.lastIndexOf("/")+1));
					////////////////////////////////////////////////////////
					let schemaPath = error.absoluteKeywordLocation.substr(error.absoluteKeywordLocation.lastIndexOf("#")+2).replaceAll("/", " > ");
					console.log("schema location:", schemaPath);
					let schemaSelectedObject = selectObjectFromJson(schemajson, schemaPath);
					console.log( "schema value:", JSON.stringify(schemaSelectedObject,
						function(k, v) {
						    let v2 = JSON.parse(JSON.stringify(v));
						    if (typeof v2 === 'object') {
							    for (let o in v2) {
								    /*
								if (typeof v2[o] === 'object') {
									    v2[o] = "|omitted|";
								}
								*/
							    }
						    }
						    return v2;
						}));

					////////////////////////////////////////////////////////
					let instancePath = error.instanceLocation.substr(error.instanceLocation.lastIndexOf("#")+2).replaceAll("/", " > ");
					console.log("instance location:", instancePath)
					let instanceSelectedObject = selectObjectFromJson(json, instancePath);
					console.log("instancd value:", JSON.stringify(instanceSelectedObject));
					console.log( "instance shorthand value:", JSON.stringify(instanceSelectedObject,
						function(k, v) {
						    let v2 = JSON.parse(JSON.stringify(v));
						    if (typeof v2 === 'object') {
							    for (let o in v2) {
								if (typeof v2[o] === 'object') {
									    v2[o] = "|omitted|";
								}
							    }
						    }
						    return v2;
						}));
					console.log();
				}
			}
		}
	})
	.catch(error => {
		console.error("Error caught problem with JSON", error);
	});
}

async function parseAndValidate() {
	let schema = JSON.parse(docuument.querySelector("#textarea1"));
	let schemajson = JSON.parse(schema);
	registerSchema(schemajson, schemaUri);
	console.log("Schema 4.1 registered");
	validateJSON(JSON.parse(docuument.querySelector("#textarea2")), schemaUri, schemajson);
}
