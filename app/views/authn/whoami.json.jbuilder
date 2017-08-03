if @user
  json.extract! @user, :id, :provider, :uid, :name, :email
  # this is a copy of the partial view for image
  if @user.image_id.present?
  	json.content_url image_content_url(@user.image_id)
  end
  json.user_roles @roles do |role|
    json.role_name role[0]
    json.resource role[1]  if role[1]
  end
end
