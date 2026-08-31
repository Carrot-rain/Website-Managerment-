export type HeroProps={
    title:string;
    subtitle:string;
}

export default function Hero({title, subtitle}: HeroProps) {


    return (

        <section>

            <h1>
                {title}
            </h1>


            <p>
                {subtitle}
            </p>


        </section>

    )

}