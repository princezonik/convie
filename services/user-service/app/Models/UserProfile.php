<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


// #[Fillable(['user_id', 'phone', 'avatar', 'bio'])]
class UserProfile extends Model
{
   protected $fillable = ['user_id','phone','avatar','bio'];


}
