class Dream < ActiveRecord::Base
  attr_accessible :title, :date, :entry

  has_many :themes
end