class Image < ActiveRecord::Base
  include Protectable
  attr_accessor :image_content

  has_many :thing_images, inverse_of: :image, dependent: :destroy
  has_many :things, through: :thing_images

  
  def basename
    caption || "image-#{id}"
  end

  scope:not_user_image, -> {
 	# search for users with image id [ user.where.not(image_id:nil)]
 	where('Images.id not in (?)', User.where.not(image_id:nil)).pluck(:image_id)

  }

end
