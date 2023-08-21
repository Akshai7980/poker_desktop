import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarSelection {
  getRandomObjectFromArray(array: any) {
    // Generate a random index based on the length of the array
    const randomIndex = Math.floor(Math.random() * array.length);

    // Return the object at the randomly generated index
    return array[randomIndex];
  }
}
