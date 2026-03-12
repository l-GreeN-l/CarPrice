function test_calls_and_promts() {
  const cars = [

    `Nissan X-Trail t31 2.0 л, 150 л.с., дизель, АКПП, полный привод (4WD)`,
    'Mitsubishi Outlander 2012, джип/suv 5 дв., 3 поколение 2.0 л, 146 л.с., бензин, вариатор (CVT), передний привод'
    // `Renault Kaptur 2.0 143 ЛС АКПП 4 WD`
     ]


calls_and_promts(cars)

}


function test_parse_configurations(){
  const input_text = `
      Nissan X-Trail t31 2.0 л, 150 л.с., дизельный двигатель, РКПП, полный привод (4WD) Тут какая то хуйня
      2WD + 250 ЛС Ford Camry
  Mitsubishi Outlander 2012, джип/suv 5 дв., 3 поколение 2.0 л, 146 л.с., бензин, вариатор (CVT), передний привод
  `
  const configurations = config_validation(input_text)
  console.log(configurations)
  
  configurations["cars"].forEach(function(model){
    console.log(model)

  })
    configurations["errors"].forEach(function(model){
    console.log(model)

  })

}


/**
 * Тест с новыми данными
 */
function testAutoFunction() {
  const carSpecs = {
    "model": "Nissan Terrano",
    "configuration": "2.0 143 л.с. АКПП 4WD",
    "fuel_consumption": 11.3,
    "fuel_type": "A95"

  };

  const mainNodes = [

    { "name": "Двигатель (F4R, бензиновый)", "resourse_min": 250000, "resourse_max": 400000, "price_detail": 300000, "price_work": 25000 },

    { "name": "Трансмиссия (АКПП, DP2/DP8)", "resourse_min": 250000, "resourse_max": 350000, "price_detail": 200000, "price_work": 15000 }

  ];
  const suspension = [

    { "name": "Амортизаторы передние", "resourse_min": 80000, "resourse_max": 120000, "price_detail": 12000, "price_work": 4000 }

  ];

  createAutoAnalysisSheet(carSpecs, mainNodes, suspension, [], [], []);
}





