export type FeatureProps = {
    items: string[];
};

export default function Feature({items}: FeatureProps) {


    return (

        <section>


            <h2>
                Features
            </h2>


            <ul>

            {
                items.map(

                    (item)=>(

                        <li key={item}>

                            {item}

                        </li>

                    )

                )

            }


            </ul>


        </section>

    )

}