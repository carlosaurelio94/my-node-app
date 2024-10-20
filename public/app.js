document.querySelectorAll('#todo-list li').forEach(item => {
    // Mostrar/ocultar la explicación al hacer clic en la tarea
    item.addEventListener('click', function() {
        const explanation = this.querySelector('.explanation');
        explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
    });

    // Cambiar el estado de la tarea al marcar/desmarcar el checkbox
    const checkbox = item.querySelector('input');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            item.classList.remove('incomplete');
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
            item.classList.add('incomplete');
        }
    });
});
