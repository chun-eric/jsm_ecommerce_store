import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// we have to create a sanity client
// cd into sanity ecommerce --> sanity manage --> grab all the info from there
export const client = sanityClient({
  projectId: "3snmox2h",
  dataset: "ecommerce",
  apiVersion: "2022-03-10",
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
