{
    //method to submit form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDOM(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to create post in DOM
    let newPostDOM = function (post) {
        return $(`
        <li id="post-${post._id}">
    <p>
              <small>
               <a class="delete-post-button" href="/posts/destroy/${post._id}">x</a>
              </small>
  
              ${post.content}
    <br>
    <small>
       
            ${post.user.name}
      
    </small>
    <br>
    <small>
    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
               0 <i class="fa-light fa-heart" style="color: #f70202;"></i>
            </a>
    </small>
    </p>
    
    <div class="post-comments">
       
           <form action="/comments/create" method="post">
              <input type="text" name="content" placeholder="Type here to add comment..." required>
              <input type="hidden" name="post" value=" ${post._id}">
              <input type="submit" value="Comment">
          </form>
        
          <div class="post-comments-list">
           <ul id="post-comments- ${post._id}">
               
           </ul>
          </div>
       </div>
</li>
        `)
    }

//method to delete a post from DOM
let deletePost = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            },error: function(error){
                console.log(error.responseText);
            }
        });
    });
}

    createPost();
}