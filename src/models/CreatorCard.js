import mongoose from "mongoose";

const creatorCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
    default: '',
  },
  slug: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    match: /^[a-zA-Z0-9_-]+$/,
  },
  creator_reference: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 20,
  },
  links: {
    type: [{
      title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      url: {
        type: String,
        required: true,
        maxlength: 200,
        validate: {
          validator: function(v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: 'URL must start with http:// or https://'
        }
      }
    }],
    default: [],
  },
  service_rates: {
    currency: {
      type: String,
      enum: ['NGN', 'USD', 'GBP', 'GHS'],
    },
    rates: [{
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
      },
      description: {
        type: String,
        maxlength: 250,
        default: '',
      },
      amount: {
        type: Number,
        required: true,
        min: 1,
        validate: {
          validator: Number.isInteger,
          message: 'Amount must be an integer'
        }
      }
    }],
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published'],
  },
  access_type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  access_code: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.access_type === 'private') {
          return v && /^[A-Za-z0-9]{6}$/.test(v);
        }
        return v == null;
      },
      message: 'access_code must be exactly 6 alphanumeric characters for private cards, or null for public cards'
    }
  },
  deleted: {
    type: Number,
    default: null,
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  }
});

// Pre-save middleware to handle access_code validation
creatorCardSchema.pre('save', function(next) {
  // Ensure updated timestamp is set
  this.updated = Date.now();
  
  // Validate access_code based on access_type
  if (this.access_type === 'public' && this.access_code) {
    next(new Error('access_code can only be set on private cards'));
  } else if (this.access_type === 'private' && !this.access_code) {
    next(new Error('access_code is required when access_type is private'));
  } else if (this.access_type === 'private' && !/^[A-Za-z0-9]{6}$/.test(this.access_code)) {
    next(new Error('access_code must be exactly 6 alphanumeric characters'));
  } else if (this.access_type === 'public') {
    this.access_code = null;
    next();
  } else {
    next();
  }
});

// Index for faster queries
creatorCardSchema.index({ slug: 1 }, { unique: true });
creatorCardSchema.index({ creator_reference: 1 });
creatorCardSchema.index({ status: 1 });

// Transform the document for API responses
creatorCardSchema.set('toJSON', {
  transform: function(doc, ret) {
    // Map _id to id (ObjectId will be converted to string automatically)
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const CreatorCard = mongoose.model('CreatorCard', creatorCardSchema);

export default CreatorCard;