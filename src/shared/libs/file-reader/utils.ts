import { CiryCoords } from '../../types/cities.js';
import { Offer, OfferType } from '../../types/offer.js';

const getCoords = (coords: string): CiryCoords => {
  const [latitude, longitude] = coords.split(';');
  return { latitude: Number.parseInt(latitude, 10), longitude: Number.parseInt(longitude, 10) };
};

export const convertRawDataToOffers = ([
  title,
  description,
  createdDate,
  city,
  preview,
  photos,
  rating,
  type,
  roomsCount,
  guestsCount,
  price,
  comforts,
  name,
  email,
  avatar,
  password,
  userType,
  commentsCount,
  coords
]: string[]): Offer => ({
  title,
  description,
  postDate: new Date(createdDate),
  city,
  preview,
  photos: photos.split(';').map((photo) => photo),
  premium: Math.random() < 0.5,
  favored: Math.random() < 0.5,
  rating: Number.parseInt(rating, 10),
  roomsCount: Number.parseInt(roomsCount, 10),
  guestsCount: Number.parseInt(guestsCount, 10),
  type: type as OfferType,
  commentsCount: Number.parseInt(commentsCount, 10),
  coords: getCoords(coords),
  comforts: comforts.split(';').map((value) => value),
  price,
  author: { name, email, password, avatar, type: userType as 'standard' | 'pro' },
});
