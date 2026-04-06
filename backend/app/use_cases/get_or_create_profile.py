from app.adapters.db.session import db
from app.models.profile import Profile


class GetOrCreateProfileUseCase:
    def execute(self, user_id: str) -> Profile:
        profile = Profile.query.filter_by(user_id=user_id).first()

        if not profile:
            profile = Profile(user_id=user_id)
            db.session.add(profile)
            db.session.commit()

        return profile
