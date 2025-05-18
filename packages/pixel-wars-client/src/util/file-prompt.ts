export function launchFilePrompt(callback: (content: string) => void) {
  const filePrompt = document.createElement("input")
  filePrompt.type = "file"
  
  const existingPrompt = document.getElementById("filePrompt")
  if (existingPrompt)
    existingPrompt.remove()

  filePrompt.id = "filePrompt"
  filePrompt.style.display = "none"
  filePrompt.accept = "application/JSON"
  document.body.appendChild(filePrompt)
  filePrompt.click()

  filePrompt.addEventListener("change", async () => {
    if (!filePrompt.files)
      return

    filePrompt.remove()

    const file = filePrompt.files[0]
    const text = await file.text()

    callback(text)
  })
}
