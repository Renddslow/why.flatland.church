$(() => {
  $(".books").keyup(() => {
    var numberOfBooks = parseInt($(".books").val());
    var total = numberOfBooks * 10 || 0;
    $(".support-total em").html(`$${total}`);
  });

  let stripe = Stripe('pk_test_Mxyh3oAiLIvNCLJ0AAaVjAPN');
  let elements = stripe.elements();
  let style = {
    base: {
      color: '#32325d',
      lineHeight: '24px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  var card = elements.create('card', {style: style});
  card.mount('#card-element');

	card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
	  if (event.error) {
	    displayError.textContent = event.error.message;
	  } else {
	    displayError.textContent = '';
	  }
	});

	var form = document.getElementById('payment-form');
	form.addEventListener('submit', function(event) {
	  event.preventDefault();

	  stripe.createToken(card).then(function(result) {
	    if (result.error) {
	      var errorElement = document.getElementById('card-errors');
	      errorElement.textContent = result.error.message;
	    } else {
	      stripeTokenHandler(
					result.token,
					$("#name").val().trim(),
					$("#email").val().trim(),
					$("#books").val()
				);
	    }
	  });
	});
});

const stripeTokenHandler = (token, name, email, books) => {
	let data = {
		name: name,
		email: email,
		bookCount: books,
		token: token.id
	};
	console.log(data);
}
