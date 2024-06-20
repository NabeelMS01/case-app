"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe.helper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { finish, material } = configuration;

  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;
  if (material === "metal") price += PRODUCT_PRICES.material.metal;

  let order: Order | undefined = undefined;

  console.log("====",user,'====',new Date());

  
  const existingOrder = await db.order?.findFirst({
    where: { userId: user?.id, configurationId: configuration?.id },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price,
        userId: user.id,
        configurationId: configuration.id,

      },
    });
  }


console.log(price,'========priceprice');


  const product = await stripe.products.create({
  
    name: "Custom Iphone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types:['card'],
    shipping_address_collection:{allowed_countries:['US']},
    mode:'payment',
    metadata:{
      userId:user.id,
      orderId:order.id
    },
    line_items:[{price:product.default_price as string ,quantity:1}]
  })

  return {url :stripeSession.url}
};
