async function newPostHandler(event) {
  event.preventDefault();
  const title = document.querySelector("#title-input").value.trim();
  const postBody = document.querySelector("#body-input").value.trim();

  if (title && postBody) {
    const response = await fetch(`/api/posts`, {
      method: "POST",
      body: JSON.stringify({
        post_title: title,
        post_body: postBody,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector("#post-form").addEventListener("submit", newPostHandler);
