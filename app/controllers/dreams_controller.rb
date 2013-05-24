class DreamsController < ApplicationController
  def index
    respond_to do |format|
      format.html {render :index}
      format.json {render json: Dream.all}
    end
  end

  def create

  end

  def update

  end
end