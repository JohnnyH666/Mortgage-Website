"""
    Calculator

    This module contains functions to perform different calculations
    needed for loan applications and other mortgage bank services. 

"""

INTEREST_RATE = 0.041

def mortgage_payment(principal: float, term: str, duration: int):
    """
    Mortgage payment calculator

    Formula used:
        Payment = principal * (r/1-(1+r)**-n)
        where r is monthly interest rate
        n is number of montly payments

    Parameters:
    - principal: Starting balance of the loan
    - term: pfrequency of payments "Monthly", "Yearly"
    - duration: length of loan repayment plan in years

    Returns:
    - Payment: Mortgage payment per term
    """

    n = num_payments(duration, term.lower())
    r = INTEREST_RATE / 12

    denom = 1-(1+r)**-n
    if denom == 0:
        return 0

    return principal * (r/denom)

#### HELPER FUNCTIONS ####

def num_payments(duration: int, term: str):
    """
    Gets the number of payments to be made for a given loan

    Parameters:
    - term: pfrequency of payments "Monthly", "Yearly"
    - duration: length of loan repayment plan

    Returns:
    - Number of payments to be made
    """

    yearly_payments = 0
    if term == "monthly":
        yearly_payments = 12
    elif term == "yearly":
        yearly_payments = 1

    return yearly_payments * duration

def calculate_loan_limit(gross_income, expenses, dependents, dependent_expense_increase=0.1, mortgage_fraction=0.3, annual_interest_rate=0.0392, loan_term_years=30):
    # Increase expenses for dependents
    total_expenses = expenses * (1 + dependents * dependent_expense_increase)
    
    # Calculate net income
    net_income = gross_income - total_expenses
    
    # Calculate amount available for mortgage
    mortgage_payment = net_income * mortgage_fraction
    
    # Calculate monthly interest rate
    monthly_interest_rate = annual_interest_rate / 12
    
    # Calculate number of payments
    num_payments = loan_term_years * 12
    
    # Calculate loan limit
    loan_limit = mortgage_payment * ((1 + monthly_interest_rate)**num_payments - 1) / (monthly_interest_rate * (1 + monthly_interest_rate)**num_payments)
    
    return loan_limit

if __name__ == "__main__":

    principal = 1000000.0
    term = "monthly"
    duration = 20
    pay = mortgage_payment(principal, term, duration)
    print(pay)