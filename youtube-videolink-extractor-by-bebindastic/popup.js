document.getElementById("extract").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const includePlaylists = document.getElementById("includePlaylists").checked;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractLinks,
    args: [includePlaylists]
  }, (injectionResults) => {
    const result = injectionResults[0].result;
    const textarea = document.getElementById("result");
    textarea.value = result;
    navigator.clipboard.writeText(result).then(() => {
      console.log("Links copied to clipboard");
    });
  });
});

function extractLinks(includePlaylists) {
  let links = [];
  const anchorTags = document.querySelectorAll("a#thumbnail");

  anchorTags.forEach(a => {
    const href = a.href;
    if (href.includes("watch")) {
      links.push(href.split("&")[0]);
    }
  });

  if (includePlaylists) {
    const playlistLinks = Array.from(document.querySelectorAll("a"))
      .map(a => a.href)
      .filter(link => link.includes("playlist?list="));
    links.push(...playlistLinks);
  }

  const uniqueLinks = Array.from(new Set(links));
  return uniqueLinks.join("\n");
}