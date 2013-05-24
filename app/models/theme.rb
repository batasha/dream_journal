class Theme < ActiveRecord::Base
  attr_accessible :name

  belongs_to :dreams
end