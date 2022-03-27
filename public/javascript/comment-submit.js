async function commentFormHandler(event) {
  const post_id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
    ];
  const commentBody = document.querySelector('#comment-input').value.trim();
  event.preventDefault();
  console.log(commentBody);
  if (commentBody) {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        body: JSON.stringify({
          comment_body: commentBody,
          post_id: post_id
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
}


document.querySelector('#comment-form').addEventListener('submit', commentFormHandler); 