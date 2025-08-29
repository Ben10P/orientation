// Initialisation LocalStorage
if(!localStorage.getItem('orientation')) {
    localStorage.setItem('orientation', JSON.stringify({
        notes: {},
        metiers: [],
        qcm: {}
    }));
}

// Fonctions pour stocker et récupérer les données
function saveNotes(notes) {
    const data = JSON.parse(localStorage.getItem('orientation'));
    data.notes = notes;
    localStorage.setItem('orientation', JSON.stringify(data));
}

function saveMetiers(metiers) {
    const data = JSON.parse(localStorage.getItem('orientation'));
    data.metiers = metiers;
    localStorage.setItem('orientation', JSON.stringify(data));
}

function saveQCM(qcm) {
    const data = JSON.parse(localStorage.getItem('orientation'));
    data.qcm = qcm;
    localStorage.setItem('orientation', JSON.stringify(data));
}

function getOrientationData() {
    return JSON.parse(localStorage.getItem('orientation'));
}

// Définition des séries et matières dominantes
const seriesDominantes = {
    "A1": ["francais", "anglais"],
    "A2": ["francais", "histoire"],
    "B":  ["mathematiques", "histoire"],
    "C":  ["mathematiques", "physique"],
    "D":  ["mathematiques", "svt"],
    "F":  ["mathematiques", "physique"],
    "G":  ["mathematiques", "francais"]
};

// Liens métiers → séries possibles
const metiersSeries = {
    "Ingénieur en informatique": ["C", "F"],
    "Architecte": ["C", "F"],
    "Médecin": ["D"],
    "Infirmier(e)": ["D"],
    "Banquier": ["B", "G"],
    "Entrepreneur": ["B", "G"],
    "Enseignant": ["A1", "A2"],
    "Journaliste": ["A1", "A2"],
    "Ingenieur BTP": ["C", "F"],
    "Avocat": ["A2", "G"],
    "Mecanicien": ["F"],
    "Gestion administratif": ["B", "G"],
    "Hôtellerie et Tourisme": ["B", "G"],   // nouveau métier
    "Agro-industriel": ["D", "C"]          // nouveau métier
};


// Calcul des 3 séries recommandées
function calculerResultat() {
    const data = getOrientationData();
    const notes = data.notes;
    const metiers = data.metiers;

    // 1️⃣ Calcul des moyennes par série
    let classSeries = [];
    for (let serie in seriesDominantes) {
        const mat1 = seriesDominantes[serie][0];
        const mat2 = seriesDominantes[serie][1];
        if(notes[mat1] !== undefined && notes[mat2] !== undefined) {
            const moyenne = (parseFloat(notes[mat1]) + parseFloat(notes[mat2])) / 2;
            classSeries.push({serie: serie, moyenne: moyenne});
        }
    }

    // 2️⃣ Tri par moyenne décroissante
    classSeries.sort((a,b) => b.moyenne - a.moyenne);

    // 3️⃣ Sélection des 2 premières séries
    let recommandations = [classSeries[0].serie, classSeries[1].serie];

    // 4️⃣ Détermination de la 3ᵉ série selon métiers
    let listSeriesMetiers = [];
    metiers.forEach(m => {
        if(metiersSeries[m]) {
            listSeriesMetiers = listSeriesMetiers.concat(metiersSeries[m]);
        }
    });
    // Supprimer doublons et les séries déjà sélectionnées
    listSeriesMetiers = [...new Set(listSeriesMetiers)].filter(s => !recommandations.includes(s));

    if(listSeriesMetiers.length > 0) {
        // Choisir celle avec meilleure moyenne dans classSeries
        listSeriesMetiers.sort((a,b) => {
            const mA = classSeries.find(s => s.serie === a)?.moyenne || 0;
            const mB = classSeries.find(s => s.serie === b)?.moyenne || 0;
            return mB - mA;
        });
        recommandations.push(listSeriesMetiers[0]);
    }

    return recommandations.slice(0,3);
}

// Exemple d'utilisation :
// const resultats = calculerResultat();
// console.log("Séries recommandées :", resultats);
