const form = document.getElementById('form');
const litControl = document.querySelector('lit-control');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  console.log({
    complex: data.get('complex-demo'),
  });
});
