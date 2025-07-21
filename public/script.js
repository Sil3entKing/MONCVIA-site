document.addEventListener("DOMContentLoaded", () => {
  const outputCV = document.getElementById("cv-html");
  const outputLettre = document.getElementById("lettreResultat");
  const API_URL = "https://moncvia-backend.onrender.com/api";

  // Fonction pour convertir du Markdown en HTML simple
  function markdownToHTML(markdown) {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Gras
      .replace(/\*(.*?)\*/g, "<em>$1</em>")             // Italique
      .replace(/^- (.*)$/gm, "<li>$1</li>")             // Liste
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")       // Liste complète
      .replace(/\n{2,}/g, "<br><br>");                  // Paragraphes
  }

  // 🔹 Générer le CV
  document.getElementById("cvForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("nom").value;
    const poste = document.getElementById("poste").value;
    const experience = document.getElementById("experience").value;
    const competences = document.getElementById("competences").value;
    const formation = document.getElementById("formation").value;

    const prompt = `
Crée un CV professionnel avec ces informations :
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
          prompt,
          role: "Tu es un assistant qui crée des CV professionnels."
        })
      });

      const data = await res.json();
      outputCV.innerHTML = markdownToHTML(data.response || "❌ Aucune réponse.");
    } catch (err) {
      outputCV.innerHTML = "❌ Erreur IA : " + err.message;
    }
  });

  // 🔹 Traduire le CV
  document.getElementById("traduireCV").addEventListener("click", async () => {
    const langue = document.getElementById("langueCV").value;
    const contenu = outputCV.innerText;
    if (!contenu || !langue) return alert("Génère un CV et choisis une langue.");

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
      outputCV.innerHTML = markdownToHTML(data.response || "❌ Erreur de traduction.");
    } catch (err) {
      alert("Erreur de traduction : " + err.message);
    }
  });

  // 🔹 Générer la lettre
  document.getElementById("lettreForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("nomLettre").value;
    const poste = document.getElementById("posteLettre").value;
    const motivation = document.getElementById("motivation").value;

    const prompt = `
Rédige une lettre de motivation :
Nom : ${nom}
Poste : ${poste}
Motivation : ${motivation}
`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          role: "Tu es un assistant qui rédige des lettres de motivation professionnelles."
        })
      });

      const data = await res.json();
      outputLettre.innerHTML = markdownToHTML(data.response || "❌ Aucune réponse.");
    } catch (err) {
      outputLettre.innerHTML = "❌ Erreur IA : " + err.message;
    }
  });

  // 🔹 Traduire la lettre
  document.getElementById("traduireLettre").addEventListener("click", async () => {
    const langue = document.getElementById("langueLettre").value;
    const contenu = outputLettre.innerText;
    if (!contenu || !langue) return alert("Génère une lettre et choisis une langue.");

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
      outputLettre.innerHTML = markdownToHTML(data.response || "❌ Erreur de traduction.");
    } catch (err) {
      alert("Erreur de traduction : " + err.message);
    }
  });

  // 🔹 Exporter en Word (CV)
  document.getElementById("export-word-cv").addEventListener("click", () => {
    const contenu = outputCV.innerHTML;
    if (!contenu.trim()) return alert("Aucun CV à exporter !");
    exporterEnWord(contenu, "MonCVIA_CV");
  });

  // 🔹 Exporter en Word (Lettre)
  document.getElementById("export-word-lettre").addEventListener("click", () => {
    const contenu = outputLettre.innerHTML;
    if (!contenu.trim()) return alert("Aucune lettre à exporter !");
    exporterEnWord(contenu, "MonCVIA_Lettre");
  });

  // 🔹 Fonction générique
  function exporterEnWord(htmlContent, filename) {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + htmlContent + footer;

    const sourceBlob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(sourceBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename + ".doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
