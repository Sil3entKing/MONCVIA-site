document.addEventListener("DOMContentLoaded", () => {
  const outputCV = document.getElementById("cv-html");
  const outputLettre = document.getElementById("lettreResultat");
  const API_URL = "https://moncvia-backend.onrender.com/api";

  // Générateur de CV
  document.getElementById("cvForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("nom").value;
    const poste = document.getElementById("poste").value;
    const experience = document.getElementById("experience").value;
    const competences = document.getElementById("competences").value;
    const formation = document.getElementById("formation").value;

    const prompt = `
Crée un CV professionnel clair avec ces infos :
Nom : ${nom}
Poste : ${poste}
Expérience : ${experience}
Compétences : ${competences}
Formation : ${formation}
`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          role: "Tu es un assistant qui crée des CV professionnels."
        })
      });

      const data = await res.json();
      outputCV.innerHTML = data.response?.replace(/\n/g, "<br>") || "❌ Aucune réponse de l'IA.";
    } catch (err) {
      outputCV.innerHTML = "❌ Erreur IA : " + err.message;
    }
  });

  // Traduction du CV
  document.getElementById("traduireCV").addEventListener("click", async () => {
    const langue = document.getElementById("langueCV").value;
    const contenu = document.getElementById("cv-html").innerText;

    if (!contenu || !langue) return alert("Choisis une langue et génère un CV d'abord.");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: contenu,
          role: `Traduis ce texte en ${langue}`
        })
      });

      const data = await res.json();
      document.getElementById("cv-html").innerHTML =
        data.response?.replace(/\n/g, "<br>") || "❌ Erreur de traduction.";
    } catch (err) {
      alert("Erreur de traduction : " + err.message);
    }
  });

  // Télécharger le CV en PDF
  document.getElementById("download-pdf").addEventListener("click", () => {
    const contenu = document.getElementById("cv-html");
    if (!contenu || !contenu.innerHTML.trim()) {
      alert("Aucun CV à télécharger !");
      return;
    }
    html2pdf().from(contenu).save("MonCVIA_CV.pdf");
  });

  // Générateur de lettre de motivation
  document.getElementById("lettreForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("nomLettre").value;
    const poste = document.getElementById("posteLettre").value;
    const motivation = document.getElementById("motivation").value;

    const prompt = `
Rédige une lettre de motivation convaincante pour :
Nom : ${nom}
Poste : ${poste}
Motivation : ${motivation}
`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          role: "Tu es un assistant qui rédige des lettres de motivation professionnelles."
        })
      });

      const data = await res.json();
      outputLettre.innerHTML = data.response?.replace(/\n/g, "<br>") || "❌ Aucune réponse IA.";
    } catch (err) {
      outputLettre.innerHTML = "❌ Erreur : " + err.message;
    }
  });

  // Traduction de la lettre
  document.getElementById("traduireLettre").addEventListener("click", async () => {
    const langue = document.getElementById("langueLettre").value;
    const contenu = document.getElementById("lettreResultat").innerText;

    if (!contenu || !langue) return alert("Choisis une langue et génère une lettre d'abord.");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: contenu,
          role: `Traduis ce texte en ${langue}`
        })
      });

      const data = await res.json();
      document.getElementById("lettreResultat").innerHTML =
        data.response?.replace(/\n/g, "<br>") || "❌ Erreur de traduction.";
    } catch (err) {
      alert("Erreur de traduction : " + err.message);
    }
  });
});
