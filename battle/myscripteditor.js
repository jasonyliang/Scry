var editorElement = document.getElementById('editor');

  MyScript.register(editorElement, {
    recognitionParams: {
      type: 'MATH',
      server: {
        applicationKey: '755434ee-a55a-4a10-9b38-86b75fff7d56',
        hmacKey: '61710551-40f0-4216-9b44-6bb5605fe010'
      }
    }
  });