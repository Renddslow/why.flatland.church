$(() => {
  $(".books").keyup(() => {
    var numberOfBooks = parseInt($(".books").val());
    var total = numberOfBooks * 10 || 0;
    $(".support-total em").html(`$${total}`);
  });

	var today = new Date().getDate();
	var recurringDate = today > 28 ? 28 : today;
	
	$("#recurring-day").html(recurringDate);

	if ($("#recurring").prop("checked")) {
		$("#recurring-message").show();
	} else {
		$("#recurring-message").hide();
	}

	$("#recurring").change(()=> {
		if ($("#recurring").prop("checked")) {
			$("#recurring-message").show();
		} else {
			$("#recurring-message").hide();
		}
	});

  let stripe = Stripe('pk_live_pNcIV0BFJ5tqyI1vPkXzm0hr');
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
		$("#submit").prop("disabled", true);
		$("#submit").html("Submitting...");

	  stripe.createToken(card).then(function(result) {
	    if (result.error) {
	      var errorElement = document.getElementById('card-errors');
	      errorElement.textContent = result.error.message;
	    } else {
	      stripeTokenHandler(
					result.token,
					$("#name").val().trim(),
					$("#email").val().trim(),
					$("#books").val(),
					$("#recurring").prop("checked")
				);
	    }
	  });
	});
});

const stripeTokenHandler = (token, name, email, books, recurring) => {
	let data = {
		name: name,
		email: email,
		total: parseInt(books * 1000),
		token: token.id,
		recurring: recurring
	};
	$.ajax({
		type: 'POST',
		url: 'https://api.flatland.church/v1/campaigns/why/donations',
		data: data,
		success: function(res) {
			$("#payment-form").hide();
			$("#message-container").html(res.message);
		},
		error: function(res) {
			$("#message-container").html();
		}
	});
}
