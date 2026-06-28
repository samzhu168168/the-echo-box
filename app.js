document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('binder-form');
    const preview = document.getElementById('binder-preview');
    const printButton = document.getElementById('print-button');
    const downloadTextButton = document.getElementById('download-text-button');
    const clearButton = document.getElementById('clear-button');
    const sampleFillButton = document.getElementById('sample-fill-button');
    const progressLabel = document.getElementById('progress-label');
    const progressBar = document.getElementById('progress-bar');
    const storageKey = 'echoBoxEmergencyBinderDraft';

    const fields = [
        { name: 'preparedFor', label: 'Prepared for' },
        { name: 'emergencyContacts', label: 'Emergency contacts' },
        { name: 'doctorsMedications', label: 'Doctors and medications' },
        { name: 'insuranceInfo', label: 'Insurance and ID information' },
        { name: 'billsSubscriptions', label: 'Bills, subscriptions, and accounts' },
        { name: 'documentsLocation', label: 'Where important documents are' },
        { name: 'homePets', label: 'Home, pets, and daily instructions' },
        { name: 'careWishes', label: 'Care preferences and wishes' },
        { name: 'finalNote', label: 'What I want my family to know' }
    ];

    const samples = {
        preparedFor: 'Elaine Carter',
        emergencyContacts: 'Call Daniel first: 555-0142. Neighbor with spare key: Mrs. Lopez, 555-0188. Sister: Nora, 555-0109.',
        doctorsMedications: 'Primary doctor: Dr. Hale, Greenview Family Clinic. Pharmacy: Northside CVS. Current meds: blood pressure medication every morning. Allergy: penicillin.',
        insuranceInfo: 'Medicare card is in the blue wallet. Supplemental insurance folder is in the top desk drawer. Photo ID is in the nightstand tray.',
        billsSubscriptions: 'Mortgage autopays on the 3rd. Electric and water autopay from checking. Phone bill due on the 12th. Cancel meal delivery if away from home for more than one week.',
        documentsLocation: 'Will, power of attorney, car title, and birth certificate are in the fireproof box in the closet. Attorney: Miller & Stone, 555-0199.',
        homePets: 'Feed Rosie half a cup morning and evening. Vet: Willow Animal Care. Main water shutoff is behind the laundry room panel. Spare key is with Mrs. Lopez.',
        careWishes: 'I prefer comfort, clarity, and family communication. Please check legal documents before making major decisions. This note is not a legal directive.',
        finalNote: 'Do not let a hard week make you feel alone. I made this so you would not have to guess. Start with the practical things, then breathe.'
    };

    function getData() {
        return fields.reduce((data, field) => {
            const input = form.elements[field.name];
            data[field.name] = input ? input.value.trim() : '';
            return data;
        }, {});
    }

    function setData(data) {
        fields.forEach((field) => {
            const input = form.elements[field.name];
            if (input && Object.prototype.hasOwnProperty.call(data, field.name)) {
                input.value = data[field.name];
            }
        });
        updateProgress();
    }

    function saveDraft() {
        localStorage.setItem(storageKey, JSON.stringify(getData()));
    }

    function loadDraft() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
            setData(saved);
        } catch (error) {
            localStorage.removeItem(storageKey);
        }
    }

    function updateProgress() {
        const data = getData();
        const started = fields.filter((field) => data[field.name].length > 0).length;
        progressLabel.textContent = `${started} of ${fields.length} sections started`;
        progressBar.style.width = `${Math.round((started / fields.length) * 100)}%`;
    }

    function createSection(label, value) {
        const section = document.createElement('section');
        section.className = 'print-section';

        const heading = document.createElement('h3');
        heading.textContent = label;

        const paragraph = document.createElement('p');
        paragraph.textContent = value || 'Not filled yet.';

        section.append(heading, paragraph);
        return section;
    }

    function generateBinder(data) {
        preview.classList.remove('empty');
        preview.replaceChildren();

        const article = document.createElement('article');
        article.className = 'print-doc';

        const title = document.createElement('h2');
        title.textContent = `${data.preparedFor || 'Family'} Emergency File`;

        const meta = document.createElement('div');
        meta.className = 'doc-meta';
        const updated = document.createElement('span');
        updated.textContent = `Updated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
        const disclaimer = document.createElement('span');
        disclaimer.textContent = 'Planning note only. Not legal, medical, or financial advice.';
        meta.append(updated, disclaimer);

        article.append(title, meta);
        fields.slice(1).forEach((field) => {
            article.append(createSection(field.label, data[field.name]));
        });

        preview.append(article);
        printButton.disabled = false;
        downloadTextButton.disabled = false;
    }

    function downloadText(data) {
        const lines = [
            'THE ECHO BOX - FAMILY EMERGENCY BINDER',
            `Updated: ${new Date().toLocaleDateString('en-US')}`,
            '',
            ...fields.flatMap((field) => [field.label.toUpperCase(), data[field.name] || 'Not filled yet.', '']),
            'Note: This file is an organization tool, not legal, medical, financial, or estate-planning advice.'
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'echo-box-family-emergency-binder.txt';
        link.click();
        URL.revokeObjectURL(link.href);
    }

    form.addEventListener('input', () => {
        updateProgress();
        saveDraft();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = getData();
        generateBinder(data);
        saveDraft();
        preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    printButton.addEventListener('click', () => {
        window.print();
    });

    downloadTextButton.addEventListener('click', () => {
        downloadText(getData());
    });

    clearButton.addEventListener('click', () => {
        if (!confirm('Clear this local draft?')) {
            return;
        }
        form.reset();
        localStorage.removeItem(storageKey);
        updateProgress();
        preview.className = 'binder-preview empty';
        preview.replaceChildren();
        const empty = document.createElement('p');
        empty.textContent = 'Your printable binder preview will appear here after you generate it.';
        preview.append(empty);
        printButton.disabled = true;
        downloadTextButton.disabled = true;
    });

    sampleFillButton.addEventListener('click', () => {
        setData(samples);
        saveDraft();
        generateBinder(getData());
        document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    loadDraft();
});
