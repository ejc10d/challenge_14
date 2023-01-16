const newForm = async (form) => {
    form.preventDefault();

    const name = document.querySelector('#blog-title').value.trim();
    const content = document.querySelector('#blog-content').value.trim();

    if (name && content) {
        const response = await fetch('/api/blog', {
            method: 'POST',
            body: JSON.stringify({ name, content }),
            headers: { 'Content-Type': 'application/json', },
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to post.');
        }
    }
};

const deleteButton = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const responst = await fetch(`/api/blog/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to delete post');
        }
    }
};

document.querySelector('.new-post-form').addEventListener('submit', newForm);

document.querySelector('.post-list').addEventListener('click', deleteButton);