export interface AddressComponent {
  postalCode?: string;
  state?: string;
  city?: string;
  country?: string;
  street?: string;
  streetNumber?: string;
  address?: string;
}

export interface SelectedPlace {
  placeId: string;
  components: AddressComponent;
}
