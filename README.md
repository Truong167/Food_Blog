1. Sửa api: https://food-blog-services.onrender.com/api/v1/recipe/searchRecipe?q=   

   {
         "date": "13-03-2023 15:51:56",
         "recipeId": 39,
         "recipeName": "bánh mì bơ",
         "numberOfLikes": 0,
         "image": null,
         "User": {
           "fullName": "Harry Potter",
           "avatar": null,
           "userId": 3
         }
       }

2. Thiếu API Danh sách công thức

3. Thêm field cho API 
https://food-blog-services.onrender.com/api/v1/recipe/searchRecipe?q=

https://food-blog-services.onrender.com/api/v1/recipe/search?q=

https://food-blog-services.onrender.com/api/v1/recipe/getRecipe/:id --------- xong ---------

https://food-blog-services.onrender.com/api/v1/recipe/getRecipeByIngredient/:slug

http://localhost:8080/api/v1/recipe/getRecipeFromFollowers

https://food-blog-services.onrender.com/api/v1/recipe/getAllRecipe

https://food-blog-services.onrender.com/api/v1/recipe/getPopularRecipe

Thêm response "isFavorite": true - hoặc false => Để cho biết là công thức đó => user có "Like" hay chưa

Thêm response "isPublic": true - hoặc false => Để cho biết là công thức đó có public hay không. dùng "status": CK - RT

Thêm response "listRecipe": là 1 array => hiển thị những list recipe có chứa công thức này.

  "success": true,
  "message": "Successfully get data",
  "data": [
    {
      "date": "13-03-2023 15:51:56",
      "recipeId": 39,
      "recipeName": "bánh mì bơ",
      "numberOfLikes": 0,
      "image": null,
      "User": {
        "fullName": "Harry Potter",
        "avatar": null,
        "userId": 3
      },
      "isFavorite": true,
      "inListRecipe": [
        {
          "id": 1,
          "name": "List A"
        },
        {
          "id": 2,
          "name": "List B"
        }
      ]
    }
    
  ]

4. Thêm field cho API  --------- xong ---------

Thêm response "isFollow": true - hoặc false => Để cho biết là user ABC có được có "Follow" hay chưa

{
  "success": true,
  "message": "Successfully get data",
  "data": {
    "user": {
      "dateOfBirth": "03-03-2023 07:00:00",
      "userId": 3,
      "fullName": "Harry Potter",
      "address": "HCM",
      "email": "example11111@gmail.com",
      "introduce": "This is introduce",
      "avatar": null,
      "isFollow": true,
      "Recipes": [
      ]
    },
    "countRecipe": 8,
    "countFollowing": 1,
    "countFollowed": 1
  }
}

5. Thêm API chi tiết danh sách công thức  
https://food-blog-services.onrender.com/api/v1/recipeList/getRecipe/:recipeListId