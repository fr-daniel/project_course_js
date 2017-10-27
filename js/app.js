(function( $, doc ){
    'use strict';

    var app = (function appController(){
        return {
            init: function(){
                console.log( 'app init' );
                this.companyInfo();
                this.initEvents();
            },

            initEvents: function initEvents(){
               $('[data-js="form-register"]').on( 'submit', this.handleSubmit );                
            },

            companyInfo: function companyInfo(){
                var ajax = new XMLHttpRequest();
                ajax.open( 'GET', 'js/company.json', true );
                ajax.send();
                ajax.addEventListener( 'readystatechange', this.getCompanyInfo, false );
            },

            getCompanyInfo: function getCompanyInfo(){
                if( !app.isReady.call( this ) )
                    return;

                var data =  JSON.parse( this.responseText );
                app.setCompanyInfo.call( data );
            },

            setCompanyInfo: function setCompanyInfo( ){
                var $companyName = $('[data-js="company-name"]').get();
                var $companyPhone = $('[data-js="company-phone"]').get();

                $companyName.textContent = this.name;
                $companyPhone.textContent = this.phone;
            },

            isReady: function isReady(){
                return this.readyState === 4 && this.status === 200;
            },

            handleSubmit: function handleSubmit( event ){
                event.preventDefault();
                var $bodyTable = $('[data-js="bodyTable"]').get();
                $bodyTable.appendChild( app.createNewCar() );
            },

            createNewCar: function createNewCar(){
                var $fragment = doc.createDocumentFragment();
                var $tr = doc.createElement('tr');
                var $tdImage = doc.createElement('td');
                var $image = doc.createElement('img');
                var $tdModel = doc.createElement('td');
                var $tdPlate = doc.createElement('td');
                var $tdYear = doc.createElement('td');
                var $tdColor = doc.createElement('td');

                $image.setAttribute( 'src', $('[data-js="image"]').get().value );
                $image.setAttribute( 'class', 'img-thumbnail' );
                $image.setAttribute( 'style', 'width: 250px; height: 200px;' );
                $tdImage.appendChild( $image );

                $tdModel.textContent = $('[data-js="brand-model"]').get().value;
                $tdPlate.textContent = $('[data-js="plate"]').get().value;
                $tdYear.textContent = $('[data-js="year"]').get().value;
                $tdColor.textContent = $('[data-js="color"]').get().value;

                $tr.appendChild( $tdImage );
                $tr.appendChild( $tdModel );
                $tr.appendChild( $tdPlate );
                $tr.appendChild( $tdYear );
                $tr.appendChild( $tdColor );
                
                return $fragment.appendChild( $tr );
            }
        };
    })();

    app.init();

})( window.DOM, document );