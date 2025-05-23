/**
 * Copyright (C) 2019  The Software Heritage developers
 * See the AUTHORS file at the top-level directory of this distribution
 * License: GNU Affero General Public License version 3, or any later version
 * See top-level LICENSE file for more information
 */

"use strict";

var SPDX_LICENSES = null;
var SPDX_LICENSE_IDS = null;

const loadSpdxData = async () => {
    const licensesResponse = await fetch("./data/spdx/licenses.json");
    const licenseList = await licensesResponse.json();
    return licenseList.licenses;
}

function initSpdx() {
    var datalist = document.getElementById('licenses');

    SPDX_LICENSES.forEach(function (license) {
        var option = document.createElement('option');
        option.value = license['licenseId'];
        option.label = `${license['licenseId']}: ${license['name']}`;
        datalist.appendChild(option);
    });

}

function insertLicenseElement(licenseId) {
    let selectedLicenses = document.getElementById("selected-licenses");
    let newLicense = document.createElement("div");
    newLicense.className = "selected-license";
    newLicense.innerHTML = `
        <span class="license-id">${licenseId}</span>
        <button type="button" class="remove-license" onclick="removeLicense(this)">Remove</button>
        `;

    selectedLicenses.appendChild(newLicense);
    return newLicense;
}

function validateLicense(e) {
    // Continuar solo si se presiona Enter o Tab
    if (e.keyCode && e.keyCode !== 13 && e.keyCode !== 9) {
        return;
    }

    const licenseField = document.getElementById('license'); // Campo visible
    const selectedLicensesHidden = document.getElementById('selectedLicensesHidden'); // Campo oculto
    let selectedLicenses = selectedLicensesHidden.value ? selectedLicensesHidden.value.split(', ') : [];

    const license = licenseField.value.trim();

    if (SPDX_LICENSE_IDS !== null && SPDX_LICENSE_IDS.indexOf(license) === -1) {
        licenseField.setCustomValidity('Unknown license id');
    } else {

        if (!selectedLicenses.includes(license)) {
            selectedLicenses.push(license);
            selectedLicensesHidden.value = selectedLicenses.join(', ');

            licenseField.setAttribute('placeholder', selectedLicenses.join(', '));

            insertLicenseElement(license);
        }
        
        licenseField.value = ""; 
        licenseField.setCustomValidity('');
        generateCodemeta();
    }
}


function validateLicenseOld(e) {
    // continue only if Enter/Tab key is pressed
    if (e.keyCode && e.keyCode !== 13 && e.keyCode !== 9) {
        return;
    }
    // Note: For some reason e.keyCode is undefined when Enter/Tab key is pressed.
    // Maybe it's because of the datalist. But the above condition should
    // work in either case.

    var licenseField = document.getElementById('license');
    var license = licenseField.value.trim();

    if (SPDX_LICENSE_IDS !== null && SPDX_LICENSE_IDS.indexOf(license) == -1) {
        licenseField.setCustomValidity('Unknown license id');
    }
    else {
        insertLicenseElement(license);

        licenseField.value = "";
        licenseField.setCustomValidity('');
        generateCodemeta();
    }
}
function removeLicense(btn) {
    const licenseId = btn.parentElement.querySelector('.license-id').textContent; 
    const selectedLicensesHidden = document.getElementById('selectedLicensesHidden'); 
    const licenseField = document.getElementById('license'); 

    let selectedLicenses = selectedLicensesHidden.value.split(', ').filter(id => id !== licenseId);
    selectedLicensesHidden.value = selectedLicenses.join(', ');
    licenseField.setAttribute('placeholder', selectedLicenses.join(', '));
    licenseField.value = "";
    btn.parentElement.remove();
    generateCodemeta();

}


function removeLicenseOld(btn) {
    btn.parentElement.remove();
    generateCodemeta();
}

function initFields() {
    initSpdx();
}
