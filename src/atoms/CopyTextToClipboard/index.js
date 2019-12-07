function fallbackCopyTextToClipboard(text, element, param) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position="fixed";  //avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) element.setState({[param]: true});
  } catch (err) {
    // TODO: Show toaster?
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text, element, param) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text, element, param);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    element.setState({[param]: true});
  }, function(err) {
    // TODO: Show toaster?
    console.error('Async: Could not copy text: ', err);
  });
}

export default copyTextToClipboard;  