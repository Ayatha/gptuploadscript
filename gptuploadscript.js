// Create and style the button
const button = document.createElement('button');
button.textContent = 'Submit File';
button.style.backgroundColor = 'green';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.margin = '5px';

// Create and style the progress container
const progressContainer = document.createElement('div');
progressContainer.style.width = '99%';
progressContainer.style.height = '5px';
progressContainer.style.backgroundColor = 'grey';

// Create and style the progress bar
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append the progress bar to the progress container
progressContainer.appendChild(progressBar);

// Insert the button and progress container into the DOM
const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');
if (targetElement) {
  targetElement.parentNode.insertBefore(button, targetElement);
  targetElement.parentNode.insertBefore(progressContainer, targetElement);
}

// Add click event listener to the button
button.addEventListener('click', async () => {
  // Create file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,.js,.py,.html,.css,.json,.csv';
  fileInput.click();

  // Listen for file selection
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result;
      const chunks = text.match(/.{1,15000}/g);
      const numChunks = chunks.length;

      for (let i = 0; i < numChunks; i++) {
        await submitConversation(chunks[i], i + 1, file.name);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      progressBar.style.backgroundColor = 'green';
    };

    reader.readAsText(file);
  });
});

async function submitConversation(text, part, filename) {
  let chatgptReady = false;
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
  }

  const textarea = document.querySelector("textarea[tabindex='0']");
  if (textarea) {
    const enterKeyEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });
    textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
    textarea.dispatchEvent(enterKeyEvent);
  }
}