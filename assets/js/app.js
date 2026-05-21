const ICONS = {
  phone: "https://img.icons8.com/ios-filled/50/111111/phone.png",
  email: "https://img.icons8.com/ios-filled/50/111111/new-post.png",
  website: "https://img.icons8.com/ios-filled/50/111111/domain.png",
  location: "https://img.icons8.com/ios-filled/50/111111/marker.png"
};

const PRIVACY_TEXT = "La información contenida en este correo electrónico es confidencial, privilegiada y está destinada únicamente para el uso del destinatario mencionado. Si usted recibió este mensaje por error, le solicitamos notificarlo inmediatamente al remitente y eliminarlo de su sistema. Queda estrictamente prohibida cualquier divulgación, distribución o copia de este mensaje. Littus Group no se responsabiliza por la integridad de este mensaje si ha sido alterado o modificado durante su transmisión.";

const form = document.getElementById("signatureForm");
const preview = document.getElementById("preview");
const htmlOutput = document.getElementById("htmlOutput");
const statusEl = document.getElementById("status");

const fields = {
  name: document.getElementById("name"),
  role: document.getElementById("role"),
  imageUrl: document.getElementById("imageUrl"),
  phones: document.getElementById("phones"),
  emails: document.getElementById("emails"),
  websites: document.getElementById("websites"),
  locations: document.getElementById("locations"),
  privacyNotice: document.getElementById("privacyNotice")
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizeWebsiteUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return "https://" + value;
}

function phoneHref(value) {
  return "tel:" + value.replace(/[^\d+]/g, "");
}

function createIconLine(iconUrl, alt, contentHtml) {
  return `
            <div style="color: #475569; font-size: 12px; line-height: 1;">
              <img src="${iconUrl}" width="12" height="12" alt="${alt}" style="display: inline-block; vertical-align: -2px; border: 0; margin-right: 6px;"> ${contentHtml}
            </div>`;
}

function buildSignatureHtml(data) {
  const name = escapeHtml(data.name);
  const imageUrl = escapeHtml(data.imageUrl);

  const rolesHtml = data.role.map(r => `<div style="color: #5f8fd8; font-size: 13px; line-height: 1;">${escapeHtml(r)}</div>`).join("");

  const phoneLines = data.phones.map(phone => {
    const safePhone = escapeHtml(phone);
    return createIconLine(
      ICONS.phone,
      "Teléfono",
      `<a href="${phoneHref(phone)}" style="color: #475569; text-decoration: none;">${safePhone}</a>`
    );
  }).join("");

  const emailLines = data.emails.map(email => {
    const safeEmail = escapeHtml(email);
    return createIconLine(
      ICONS.email,
      "Correo",
      `<a href="mailto:${safeEmail}" style="color: #475569; text-decoration: none;">${safeEmail}</a>`
    );
  }).join("");

  const websiteLines = data.websites.map(website => {
    const safeWebsite = escapeHtml(website);
    const href = escapeHtml(normalizeWebsiteUrl(website));
    return createIconLine(
      ICONS.website,
      "Sitio web",
      `<a href="${href}" style="color: #475569; text-decoration: none;" target="_blank">${safeWebsite}</a>`
    );
  }).join("");

  const locationLines = data.locations.map(location => {
    const safeLocation = escapeHtml(location);
    return createIconLine(ICONS.location, "Ubicación", safeLocation);
  }).join("");

  const privacy = data.showPrivacyNotice ? `
  <tr>
    <td style="padding-top: 12px; font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; line-height: 1.25; color: #000000; font-weight: normal;">
      <span style="font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; line-height: 1.25; color: #000000; font-weight: normal;">
        <strong style="font-weight: bold;">AVISO DE CONFIDENCIALIDAD Y PRIVACIDAD:</strong> ${PRIVACY_TEXT}
      </span>
    </td>
  </tr>` : "";

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; max-width: 600px;">
  <tr>
    <td style="padding: 0;">
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.4; color: #475569; max-width: 600px;">
        <tr>
           <td style="padding-right: 15px; vertical-align: middle; width: 150px; text-align: center;">
            <img src="${imageUrl}"
                 width="125"
                 height="125"
                 style="display: block; margin: 0 auto; border: 0;"
                 alt="Littus Group">
          </td>
           <td style="vertical-align: middle; border-left: 3px solid #111111; padding-left: 15px;">
             <div style="font-weight: bold; font-size: 16px; color: #2f63c7; margin-bottom: 3px;">
               ${name}
             </div>
             ${rolesHtml ? `<div style="margin-bottom: 2px;">${rolesHtml}</div>` : ""}${phoneLines ? `<div style="margin-bottom: 2px;">${phoneLines}</div>` : ""}${emailLines ? `<div style="margin-bottom: 2px;">${emailLines}</div>` : ""}${websiteLines ? `<div style="margin-bottom: 2px;">${websiteLines}</div>` : ""}${locationLines ? `<div style="margin-bottom: 2px;">${locationLines}</div>` : ""}
           </td>
        </tr>
      </table>
    </td>
  </tr>${privacy}
</table>
</body>
</html>`;
}

function getFormData() {
  return {
    name: fields.name.value.trim(),
    role: splitLines(fields.role.value),
    imageUrl: fields.imageUrl.value.trim(),
    phones: splitLines(fields.phones.value),
    emails: splitLines(fields.emails.value),
    websites: splitLines(fields.websites.value),
    locations: splitLines(fields.locations.value),
    showPrivacyNotice: fields.privacyNotice.checked
  };
}

function render() {
  const html = buildSignatureHtml(getFormData());
  preview.innerHTML = html;
  htmlOutput.value = html;
  statusEl.textContent = "";
}

async function copyVisualSignature() {
  const html = htmlOutput.value;

  try {
    const blob = new Blob([html], { type: "text/html" });
    await navigator.clipboard.write([
      new ClipboardItem({ "text/html": blob })
    ]);
    statusEl.textContent = "Firma copiada. Ahora pégala en Outlook.";
  } catch (error) {
    const range = document.createRange();
    range.selectNodeContents(preview);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    statusEl.textContent = "Firma copiada usando método alternativo. Ahora pégala en Outlook.";
  }
}

async function copyHtml() {
  try {
    await navigator.clipboard.writeText(htmlOutput.value);
    statusEl.textContent = "HTML copiado.";
  } catch (error) {
    htmlOutput.select();
    document.execCommand("copy");
    statusEl.textContent = "HTML copiado usando método alternativo.";
  }
}

function downloadHtml() {
  const blob = new Blob([htmlOutput.value], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "firma-littus-group.html";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  statusEl.textContent = "Archivo HTML descargado.";
}

function loadExample() {
  fields.name.value = "Ing. John Doe";
  fields.role.value = "Coordinador de Procesos";
  fields.imageUrl.value = "https://i.imgur.com/JIupJ8C.png";
  fields.phones.value = "+593 99 123 4567";
  fields.emails.value = "johndoe@littusgroup.com";
  fields.websites.value = "www.littusgroup.com";
  fields.locations.value = "Quito, Ecuador";
  fields.privacyNotice.checked = true;
  render();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  render();
});

form.addEventListener("reset", () => {
  setTimeout(render, 0);
});

document.getElementById("copySignatureBtn").addEventListener("click", copyVisualSignature);
document.getElementById("copyHtmlBtn").addEventListener("click", copyHtml);
document.getElementById("downloadBtn").addEventListener("click", downloadHtml);
document.getElementById("resetBtn").addEventListener("click", loadExample);

Object.values(fields).forEach(field => {
  field.addEventListener("input", render);
  field.addEventListener("change", render);
});

render();
