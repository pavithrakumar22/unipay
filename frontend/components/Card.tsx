import ImageCard from "./ui/cardItem";

const Card = () => {
  return (
        <div className="flex flex-row justify-around w-[90%] flex-wrap">
            <ImageCard
            title="Convert"
            imageSrc="https://unipay7781.s3.us-east-1.amazonaws.com/convert.png"
            linkTo="/ConversionPage"
        />
        <ImageCard
            title="Wallet"
            imageSrc="https://unipay7781.s3.us-east-1.amazonaws.com/wallet.png"
            linkTo="/WalletPage"
        />
        <ImageCard
            title="Statistics"
            imageSrc="https://unipay7781.s3.us-east-1.amazonaws.com/stats.png"
            linkTo="/StatsPage"
        />
         <ImageCard
            title="Transfer"
            imageSrc="https://unipay7781.s3.us-east-1.amazonaws.com/transfer.png"
            linkTo="/TransferPage"
        />
        </div>
  );
};

export default Card;