DreamJournal::Application.routes.draw do
  # REV: Would be nice to root: to => 'dreams#index'
  
  resources :dreams
end
