def grade(autogen, answer):
    if answer.find("i_actu4lly_d0nt_know_th3_name_of_th15_crypt0sy5tem") != -1:
        return { "correct": True, "message": "Correct!" }
    return { "correct": False, "message": "Nope, try again." }